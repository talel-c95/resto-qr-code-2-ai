interface DynamicMenuBadgeProps {
  tag: string;
}

const tagStyles: Record<string, { label: string; className: string }> = {
  trending: { label: "🔥 Trending", className: "bg-orange-100 text-orange-700" },
  "chef-recommendation": { label: "⭐ Chef's Pick", className: "bg-yellow-100 text-yellow-700" },
  vegetarian: { label: "🌱 Vegetarian", className: "bg-green-100 text-green-700" },
  "ai-recommended": { label: "🤖 AI Pick", className: "bg-indigo-100 text-indigo-700" },
};
export function DynamicMenuBadge({ tag }: DynamicMenuBadgeProps) {
  const style = tagStyles[tag] ?? { label: tag, className: "bg-gray-100 text-gray-700" };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${style.className}`}>
      {style.label}
    </span>
  );
}