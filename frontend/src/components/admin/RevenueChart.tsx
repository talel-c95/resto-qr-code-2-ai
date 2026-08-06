import { motion } from "framer-motion";

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const width = 700;
  const height = 220;
  const barGap = 16;
  const barWidth = (width - barGap * (data.length - 1)) / data.length;

  return (
    <div className="bg-charcoal border border-gold/20 rounded-lg p-4">
      <svg viewBox={`0 0 ${width} ${height + 30}`} className="w-full h-auto">
        {data.map((d, i) => {
          const barHeight = (d.revenue / max) * height;
          const x = i * (barWidth + barGap);
          const y = height - barHeight;
          const label = new Date(d.date).toLocaleDateString(undefined, { weekday: "short" });

          return (
            <g key={d.date}>
              <motion.rect
                initial={{ height: 0, y: height }}
                animate={{ height: barHeight, y }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                x={x}
                width={barWidth}
                rx={4}
                fill="#FF8A3D"
              />
              <text
                x={x + barWidth / 2}
                y={height + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#8D8A99"
                fontFamily="IBM Plex Mono, monospace"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}