import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from "framer-motion";
import { QrCode } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMenu } from '@/hooks/useMenu';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FEATURED_TAGS = ['chef-recommendation', 'trending', 'best-seller'];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { items, loading } = useMenu(undefined);

  const featured = items.filter((it) => it.tags?.some((t) => FEATURED_TAGS.includes(t))).slice(0, 6);
  const dishesToShow = featured.length > 0 ? featured : items.slice(0, 6);

  return (
    <div className="min-h-screen bg-noir flex flex-col font-sans relative overflow-hidden">
      {/* Floating gradient blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gold/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 -right-24 w-80 h-80 bg-rust/20 rounded-full blur-3xl animate-blob-delay" />

      {/* Hero */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative px-6 pt-16 pb-8 text-center"
      >
        <motion.p variants={item} className="font-mono text-xs tracking-[0.25em] text-gold uppercase mb-4">
          Digital Menu · Table Service
        </motion.p>
        <motion.h1 variants={item} className="font-display text-5xl font-semibold text-linen mb-3">
          Resto AI
        </motion.h1>
        <motion.p variants={item} className="text-smoke text-sm max-w-xs mx-auto leading-relaxed">
          Your table, your pace. Scan the code, browse the menu, and order
          without waving anyone down.
        </motion.p>
      </motion.div>

      {/* Action area */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative px-6 py-10 flex flex-col items-center"
      >
        {isAuthenticated && (
          <motion.p variants={item} className="text-sm text-smoke mb-6 font-mono">
            Welcome back, {user?.email}
          </motion.p>
        )}

        <div className="w-full max-w-xs flex flex-col gap-4">
          <motion.button
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/scan')}
            className="bg-gold text-noir py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 animate-glow"
          >
            <QrCode size={20} strokeWidth={2} />
            Scan QR Code
          </motion.button>

          {!isAuthenticated && (
            <motion.button
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/guest')}
              className="bg-charcoal border border-gold/30 text-linen py-4 rounded-xl font-medium text-base hover:border-gold/60 transition-colors"
            >
              Continue as Guest
            </motion.button>
          )}

          {isAuthenticated ? (
            <motion.div variants={item} className="flex justify-center gap-4 text-xs font-mono uppercase tracking-wide text-smoke mt-4">
              <button onClick={() => navigate('/history')} className="underline decoration-gold decoration-2 underline-offset-4 hover:text-linen">
                Order History
              </button>
              <span className="text-smoke/40">|</span>
              <button onClick={logout} className="underline decoration-rust decoration-2 underline-offset-4 hover:text-linen">
                Log Out
              </button>
            </motion.div>
          ) : (
            <motion.div variants={item} className="flex justify-center gap-2 text-sm text-smoke mt-4">
              <span>Already have an account?</span>
              <button onClick={() => navigate('/login')} className="text-gold font-semibold underline underline-offset-2">
                Log in
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Featured dishes */}
      <div className="relative px-6 pb-12">
        <div className="flex items-baseline justify-between max-w-md mx-auto mb-4">
          <h2 className="font-display text-2xl font-semibold text-linen">Chef's Picks</h2>
          <span className="font-mono text-xs uppercase tracking-wide text-smoke">Today</span>
        </div>

        {loading ? (
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-charcoal animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-md mx-auto grid grid-cols-2 gap-3"
          >
            {dishesToShow.map((dish) => (
              <motion.button
                key={dish.id}
                variants={item}
                whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(255,138,61,0.25)" }}
                onClick={() => navigate('/scan')}
                className="text-left bg-charcoal rounded-xl overflow-hidden border border-gold/10"
              >
                {dish.imageUrl && (
                  <img src={dish.imageUrl} alt={dish.name} className="w-full h-24 object-cover" loading="lazy" />
                )}
                <div className="p-3">
                  <h3 className="font-medium text-sm text-linen truncate">{dish.name}</h3>
                  <p className="text-xs text-gold mt-0.5">{dish.price.toFixed(2)} TND</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}