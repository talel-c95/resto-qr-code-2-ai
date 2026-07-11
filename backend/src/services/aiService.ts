/**
 * aiService — backend/src/services
 * Calls Groq (OpenAI-compatible) to power the AI Waiter chat and the
 * dynamic menu recommendation feature.
 * Stateless: no conversation persisted to DB.
 * Menu-grounded: real menu items are injected into every prompt so the AI
 * can only ever reference dishes that actually exist, and every id returned
 * is re-validated against the DB before being sent to the frontend.
 */

import OpenAI from "openai";
import { env } from "../config/env";
import { MenuItem } from "../models/MenuItem";
import { OrderItem } from "../models/OrderItem";
import { AppError } from "../utils/errors";
import {
  ChatMessage,
  AIChatResult,
  AIRecommendationItem,
  AIRecommendResult,
  TranslatedMenuItem, AITranslateResult
} from "../types/ai.types";

const groq = new OpenAI({
  apiKey: env.groqApiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = "llama-3.3-70b-versatile";

function formatMenuList(menuItems: any[]): string {
  return menuItems
    .map((item) => {
      const id = item._id.toString();
      const veg = item.isVegetarian ? " [vegetarian]" : "";
      const vegan = item.isVegan ? " [vegan]" : "";
      const tags = item.tags?.length ? ` (tags: ${item.tags.join(", ")})` : "";
      return `- id: ${id} | ${item.name} | ${item.price} DT | ${item.description}${veg}${vegan}${tags}`;
    })
    .join("\n");
}

function extractJson(raw: string): any | null {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/, "").replace(/```$/, "").trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

interface GetChatReplyInput {
  message: string;
  tableId?: string;
  history?: ChatMessage[];
}

function buildChatSystemPrompt(menuItems: any[]): string {
  return `You are a friendly AI waiter for a Tunisian restaurant. You help customers choose dishes from the menu below. ONLY recommend dishes that appear in this list — never invent a dish that isn't here.

MENU:
${formatMenuList(menuItems)}

Respond ONLY with valid JSON, no markdown, no code fences, in this exact shape:
{"reply": "your short friendly response as plain text", "suggestedItemIds": ["<menu item id>", "..."]}

Rules:
- "reply" should be 1-3 sentences, conversational, no markdown formatting.
- "suggestedItemIds" should contain 0-3 ids from the MENU list above that are relevant to what the customer asked. Use [] if nothing specific fits.
- Never include an id that is not in the MENU list.`;
}

export async function getChatReply(input: GetChatReplyInput): Promise<AIChatResult> {
  if (!input.message || !input.message.trim()) {
    throw new AppError("message is required", 400);
  }

  const menuItems = await MenuItem.find();
  const systemPrompt = buildChatSystemPrompt(menuItems);

  const historyMessages = (input.history ?? []).map((h) => ({
    role: h.role,
    content: h.content,
  }));

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...historyMessages,
        { role: "user", content: input.message },
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });
  } catch (err) {
    console.error("Groq API call failed (chat):", err);
    throw new AppError("AI waiter is unavailable right now", 502);
  }

  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = extractJson(raw);

  const reply =
    parsed && typeof parsed.reply === "string" ? parsed.reply : raw || "Sorry, I didn't catch that.";
  const rawSuggested = parsed && Array.isArray(parsed.suggestedItemIds) ? parsed.suggestedItemIds : [];

  const validIds = new Set(menuItems.map((item) => item._id.toString()));
  const suggestedItemIds = rawSuggested.filter((id: string) => validIds.has(id));

  return { reply, suggestedItemIds };
}


function getTimeBucket(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 23) return "dinner";
  return "late-night";
}

async function getPopularityMap(): Promise<Map<string, number>> {
  const results = await OrderItem.aggregate([
    { $group: { _id: "$menuItemId", totalQty: { $sum: "$quantity" } } },
  ]);

  const map = new Map<string, number>();
  for (const r of results) {
    map.set(r._id, r.totalQty);
  }
  return map;
}

function buildRecommendSystemPrompt(
  menuItems: any[],
  popularityMap: Map<string, number>,
  timeBucket: string
): string {
  const menuWithPopularity = menuItems
    .map((item) => {
      const id = item._id.toString();
      const orders = popularityMap.get(id) ?? 0;
      return `- id: ${id} | ${item.name} | orderCount: ${orders}`;
    })
    .join("\n");

  return `You are the recommendation engine for a restaurant's digital menu. It is currently ${timeBucket} time.

MENU (with real order counts so far):
${menuWithPopularity}

Pick 4 to 6 dishes to feature as "AI Recommended For You" based on a mix of real order counts and what fits well for ${timeBucket}. Only choose ids from the list above.

STRICT HONESTY RULE: the "reason" you write must never contradict the item's real orderCount.
- If orderCount is 0, you MUST NOT say "popular," "favorite," "best-seller," or anything implying prior demand. Use framing like "New on the menu," "Worth trying," or "Fresh pick" instead.
- If orderCount is 1-3, use modest framing like "Gaining interest" or "A few happy diners so far" — not "popular."
- Only use "popular," "customer favorite," or similar language when orderCount is 4 or higher.
- Every reason must be consistent with the actual number next to that item — do not invent demand that isn't reflected in orderCount.

Respond ONLY with valid JSON, no markdown, no code fences, in this exact shape:
{"recommendations": [{"menuItemId": "<id>", "reason": "short reason, under 10 words"}, ...]}`;
}

export async function getRecommendations(): Promise<AIRecommendResult> {
  const menuItems = await MenuItem.find();
  const popularityMap = await getPopularityMap();
  const timeBucket = getTimeBucket();

  const systemPrompt = buildRecommendSystemPrompt(menuItems, popularityMap, timeBucket);

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.6,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });
  } catch (err) {
    console.error("Groq API call failed (recommend):", err);
    throw new AppError("Recommendations are unavailable right now", 502);
  }

  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = extractJson(raw);

  const rawRecommendations: AIRecommendationItem[] =
    parsed && Array.isArray(parsed.recommendations) ? parsed.recommendations : [];

  const validIds = new Set(menuItems.map((item) => item._id.toString()));
  const recommendations = rawRecommendations.filter(
    (r) => r && typeof r.menuItemId === "string" && validIds.has(r.menuItemId)
  );

  return { recommendations };
}
const LANGUAGE_LABELS: Record<string, string> = {
  fr: "French",
  en: "English",
  ar: "Modern Standard Arabic",
};

function buildTranslateSystemPrompt(menuItems: any[], languageLabel: string): string {
  const menuList = menuItems
    .map((item) => `- id: ${item._id.toString()} | name: ${item.name} | description: ${item.description}`)
    .join("\n");

  return `Translate the following restaurant menu into ${languageLabel}. Keep dish names natural for a menu (you may keep well-known dish names like "Couscous" or "Pizza" as-is if that's standard in ${languageLabel}), and translate descriptions fully and naturally.

MENU:
${menuList}

Respond ONLY with valid JSON, no markdown, no code fences, in this exact shape:
{"items": [{"menuItemId": "<id>", "name": "<translated name>", "description": "<translated description>"}, ...]}

You must include EVERY item id listed above, in the same order, with no omissions.`;
}

export async function getTranslatedMenu(language: string): Promise<AITranslateResult> {
  const languageLabel = LANGUAGE_LABELS[language];
  if (!languageLabel) {
    throw new AppError("Unsupported language. Use 'fr', 'en', or 'ar'.", 400);
  }

  const menuItems = await MenuItem.find();
  const systemPrompt = buildTranslateSystemPrompt(menuItems, languageLabel);

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });
  } catch (err) {
    console.error("Groq API call failed (translate):", err);
    throw new AppError("Menu translation is unavailable right now", 502);
  }

  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = extractJson(raw);
  const rawItems: TranslatedMenuItem[] = parsed && Array.isArray(parsed.items) ? parsed.items : [];

  const translatedMap = new Map<string, TranslatedMenuItem>();
  for (const t of rawItems) {
    if (t && typeof t.menuItemId === "string") {
      translatedMap.set(t.menuItemId, t);
    }
  }

  const items: TranslatedMenuItem[] = menuItems.map((item) => {
    const id = item._id.toString();
    const translated = translatedMap.get(id);
    return {
      menuItemId: id,
      name: translated?.name?.trim() || item.name,
      description: translated?.description?.trim() || item.description,
    };
  });

  return { language: language as AITranslateResult["language"], items };
}