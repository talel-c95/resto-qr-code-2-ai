import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-charcoal border border-gold/20 rounded-lg p-4 flex items-center gap-4"
    >
      <div className="bg-gold/10 text-gold rounded-lg p-3">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-smoke font-mono uppercase">{label}</p>
        <p className="text-linen text-xl font-display font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}