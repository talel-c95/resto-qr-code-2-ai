import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Lightbulb, RefreshCw, Flame } from "lucide-react";
import { useAdminAIAnalytics } from "@/hooks/useAdminAiAnalytics";

export default function AIAnalyticsPage() {
  const { analytics, trending, loading, error, refresh } = useAdminAIAnalytics();

  return (
    <div className="min-h-screen bg-noir px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles size={22} className="text-gold" />
          <h1 className="font-display text-2xl font-semibold text-linen">AI Restaurant Analytics</h1>
        </div>
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          onClick={refresh}
          disabled={loading}
          className="bg-charcoal border border-gold/20 text-gold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:border-gold transition-colors disabled:opacity-50"
        >
          <motion.span
            animate={loading ? { rotate: 360 } : {}}
            transition={loading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
          >
            <RefreshCw size={16} />
          </motion.span>
          {loading ? "Analyzing..." : "Refresh"}
        </motion.button>
      </div>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {loading && !analytics ? (
        <p className="text-smoke">Asking the AI to look over your data...</p>
      ) : (
        <div className="flex flex-col gap-8">
          {analytics && (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-charcoal border border-gold/20 rounded-lg p-5 mb-4"
              >
                <p className="text-linen leading-relaxed">{analytics.summary}</p>
              </motion.div>

              {analytics.insights.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-mono text-xs uppercase text-smoke mb-3 flex items-center gap-2">
                    <Lightbulb size={14} /> Insights
                  </h2>
                  <div className="flex flex-col gap-2">
                    {analytics.insights.map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-noir border border-gold/10 rounded-lg p-3 text-smoke text-sm"
                      >
                        {insight}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.suggestions.length > 0 && (
                <div>
                  <h2 className="font-mono text-xs uppercase text-smoke mb-3 flex items-center gap-2">
                    <TrendingUp size={14} /> Suggestions
                  </h2>
                  <div className="flex flex-col gap-2">
                    {analytics.suggestions.map((suggestion, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-gold/10 border border-gold/30 rounded-lg p-3 text-linen text-sm"
                      >
                        {suggestion}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h2 className="font-mono text-xs uppercase text-smoke mb-3 flex items-center gap-2">
              <Flame size={14} /> Trending This Week
            </h2>
            {trending.length === 0 ? (
              <p className="text-smoke text-sm">
                Nothing showing real week-over-week growth yet — check back once you have more order history.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trending.map((item) => (
                  <motion.div
                    key={item.menuItemId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-charcoal border border-gold/20 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-linen font-medium">{item.name}</span>
                      <span className="text-lime text-xs font-mono">
                        {item.previousOrders} → {item.recentOrders}
                      </span>
                    </div>
                    <p className="text-smoke text-sm">{item.blurb}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}