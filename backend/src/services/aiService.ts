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
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { AppError } from "../utils/errors";
import {
  ChatMessage,
  AIChatResult,
  AIRecommendationItem,
  AIRecommendResult,
  TranslatedMenuItem,
  AITranslateResult,
  AIAnalyticsResult,
  AITrendingResult,
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

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function getAnalyticsInputData() {
  const completedOrders = await Order.find({ status: "completed" }).sort({ createdAt: -1 }).limit(200);
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const orderCount = completedOrders.length;
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  const orderIds = completedOrders.map((o) => o._id.toString());
  const items = await OrderItem.find({ orderId: { $in: orderIds } });

  const itemStatsMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const item of items) {
    const existing = itemStatsMap.get(item.menuItemId) ?? { name: item.name, quantity: 0, revenue: 0 };
    existing.quantity += item.quantity;
    existing.revenue += item.price * item.quantity;
    itemStatsMap.set(item.menuItemId, existing);
  }
  const topItems = Array.from(itemStatsMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8);

  const bottomItems = Array.from(itemStatsMap.values())
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  return { totalRevenue, orderCount, averageOrderValue, topItems, bottomItems };
}

function buildAnalyticsSystemPrompt(data: Awaited<ReturnType<typeof getAnalyticsInputData>>): string {
  return `You are a restaurant business analyst. Below is REAL data from this restaurant's completed orders. You must base everything you say strictly on these numbers — never invent a statistic, trend, or number that is not derivable from this data.

DATA:
- Total revenue (completed orders): ${data.totalRevenue.toFixed(2)} DT
- Number of completed orders: ${data.orderCount}
- Average order value: ${data.averageOrderValue.toFixed(2)} DT
- Top selling items: ${data.topItems.map((i) => `${i.name} (${i.quantity} sold, ${i.revenue.toFixed(2)} DT)`).join(", ") || "none yet"}
- Lowest selling items: ${data.bottomItems.map((i) => `${i.name} (${i.quantity} sold)`).join(", ") || "none yet"}

Respond ONLY with valid JSON, no markdown, no code fences, in this exact shape:
{"summary": "2-3 sentence plain-language overview of performance", "insights": ["short insight grounded in the data above", "..."], "suggestions": ["short actionable suggestion", "..."]}

Rules:
- "insights" should have 2-4 items, each one sentence, each referencing something actually in the DATA above.
- "suggestions" should have 1-3 items, each one sentence, practical for a restaurant owner.
- If order count is very low (under 5), say so honestly rather than drawing strong conclusions from too little data.
- Never state a number that isn't in the DATA section above.`;
}

export async function getRestaurantAnalytics(): Promise<AIAnalyticsResult> {
  const data = await getAnalyticsInputData();
  const systemPrompt = buildAnalyticsSystemPrompt(data);

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.4,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });
  } catch (err) {
    console.error("Groq API call failed (analytics):", err);
    throw new AppError("AI analytics is unavailable right now", 502);
  }

  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = extractJson(raw);

  return {
    summary: parsed && typeof parsed.summary === "string" ? parsed.summary : "Not enough data to summarize yet.",
    insights:
      parsed && Array.isArray(parsed.insights)
        ? parsed.insights.filter((i: unknown) => typeof i === "string")
        : [],
    suggestions:
      parsed && Array.isArray(parsed.suggestions)
        ? parsed.suggestions.filter((s: unknown) => typeof s === "string")
        : [],
  };
}

async function getTrendingInputData() {
  const recentStart = daysAgo(7);
  const previousStart = daysAgo(14);

  const recentOrders = await Order.find({ status: "completed", createdAt: { $gte: recentStart } });
  const previousOrders = await Order.find({
    status: "completed",
    createdAt: { $gte: previousStart, $lt: recentStart },
  });

  const recentIds = recentOrders.map((o) => o._id.toString());
  const previousIds = previousOrders.map((o) => o._id.toString());

  const recentItems = await OrderItem.find({ orderId: { $in: recentIds } });
  const previousItems = await OrderItem.find({ orderId: { $in: previousIds } });

  const recentMap = new Map<string, { name: string; quantity: number }>();
  for (const item of recentItems) {
    const existing = recentMap.get(item.menuItemId) ?? { name: item.name, quantity: 0 };
    existing.quantity += item.quantity;
    recentMap.set(item.menuItemId, existing);
  }

  const previousMap = new Map<string, number>();
  for (const item of previousItems) {
    previousMap.set(item.menuItemId, (previousMap.get(item.menuItemId) ?? 0) + item.quantity);
  }

  const allMenuItems = await MenuItem.find();
  const menuNameMap = new Map(allMenuItems.map((m) => [m._id.toString(), m.name]));

  const trending = Array.from(recentMap.entries())
    .map(([menuItemId, data]) => ({
      menuItemId,
      name: menuNameMap.get(menuItemId) ?? data.name,
      recentOrders: data.quantity,
      previousOrders: previousMap.get(menuItemId) ?? 0,
    }))
    .filter((i) => i.recentOrders > i.previousOrders)
    .sort((a, b) => b.recentOrders - b.previousOrders - (a.recentOrders - a.previousOrders))
    .slice(0, 5);

  return trending;
}

function buildTrendingSystemPrompt(
  trending: { menuItemId: string; name: string; recentOrders: number; previousOrders: number }[]
): string {
  const list = trending
    .map((t) => `- ${t.name}: ${t.recentOrders} orders in the last 7 days (was ${t.previousOrders} the 7 days before)`)
    .join("\n");

  return `Below are dishes with REAL rising order counts at a restaurant, comparing the last 7 days to the 7 days before that.

${list}

For each dish, write a short (under 12 words) blurb explaining it's trending, referencing the real growth honestly (e.g. "Orders nearly doubled this week" or "New interest building, worth featuring"). Do not invent numbers not shown above.

Respond ONLY with valid JSON, no markdown, no code fences, in this exact shape:
{"blurbs": [{"menuItemId": "<id>", "blurb": "<short blurb>"}, ...]}

You must include every menuItemId listed above, in the same order.`;
}

export async function getTrendingItems(): Promise<AITrendingResult> {
  const trending = await getTrendingInputData();

  if (trending.length === 0) {
    return { items: [] };
  }

  const systemPrompt = buildTrendingSystemPrompt(trending);

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.5,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });
  } catch (err) {
    console.error("Groq API call failed (trending):", err);
    // The underlying numbers are still real and correct even if the AI phrasing
    // call fails — fall back to a generic blurb instead of erroring out entirely.
    return {
      items: trending.map((t) => ({ ...t, blurb: "Trending up this week" })),
    };
  }

  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = extractJson(raw);
  const rawBlurbs: { menuItemId: string; blurb: string }[] =
    parsed && Array.isArray(parsed.blurbs) ? parsed.blurbs : [];

  const blurbMap = new Map(rawBlurbs.map((b) => [b.menuItemId, b.blurb]));

  return {
    items: trending.map((t) => ({
      ...t,
      blurb: blurbMap.get(t.menuItemId) || "Trending up this week",
    })),
  };
}