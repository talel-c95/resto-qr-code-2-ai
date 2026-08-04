interface DynamicMenuBadgeProps {
  tag: string;
}

const tagStyles: Record<string, { label: string; className: string }> = {
  trending: { label: "🔥 Trending", className: "bg-gold/15 text-gold" },
  "chef-recommendation": { label: "⭐ Chef's Pick", className: "bg-yellow-400/15 text-yellow-400" },
  vegetarian: { label: "🌱 Vegetarian", className: "bg-green-400/15 text-green-400" },
  "ai-recommended": { label: "🤖 AI Pick", className: "bg-rust/15 text-rust" },
};
export function DynamicMenuBadge({ tag }: DynamicMenuBadgeProps) {
  const style = tagStyles[tag] ?? { label: tag, className: "bg-gray-100 text-gray-700" };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${style.className}`}>
      {style.label}
    </span>
  );
}