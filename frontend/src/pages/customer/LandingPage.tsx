import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMenu } from '@/hooks/useMenu';

function TileStrip({ color = '#BF4226' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="xMidYMid slice" className="w-full h-3">
      <polyline
        points="0,12 12.5,0 25,12 37.5,0 50,12 62.5,0 75,12 87.5,0 100,12 112.5,0 125,12 137.5,0 150,12 162.5,0 175,12 187.5,0 200,12"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

const FEATURED_TAGS = ['chef-recommendation', 'trending', 'best-seller'];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { items, loading } = useMenu(undefined);

  const featured = items
    .filter((item) => item.tags?.some((tag) => FEATURED_TAGS.includes(tag)))
    .slice(0, 6);

  // fallback so the section is never empty, even if no items carry those tags
  const dishesToShow = featured.length > 0 ? featured : items.slice(0, 6);

  return (
    <div className="min-h-screen bg-sand flex flex-col font-sans">
      {/* Hero */}
      <div className="bg-sidiblue text-whitewash px-6 pt-14 pb-8 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-saffron uppercase mb-3">
          Digital Menu · Table Service
        </p>
        <h1 className="font-display text-5xl font-semibold mb-3">Resto</h1>
        <p className="text-whitewash/80 text-sm max-w-xs mx-auto leading-relaxed">
          Your table, your pace. Scan the code, browse the menu, and order
          without waving anyone down.
        </p>
      </div>

      <TileStrip color="#BF4226" />

      {/* Action area */}
      <div className="px-6 py-10 flex flex-col items-center">
        {isAuthenticated && (
          <p className="text-sm text-ink/70 mb-6 font-mono">
            Welcome back, {user?.email}
          </p>
        )}

        <div className="w-full max-w-xs flex flex-col gap-4">
          <button
            onClick={() => navigate('/scan')}
            className="bg-paprika text-whitewash py-4 rounded-xl font-medium text-base shadow-[0_4px_0_0_rgba(0,0,0,0.15)] hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all"
          >
            Scan QR Code
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => navigate('/guest')}
              className="bg-whitewash border-2 border-dashed border-sidiblue/30 text-ink py-4 rounded-xl font-medium text-base hover:border-sidiblue/60 transition"
            >
              Continue as Guest
            </button>
          )}

          {isAuthenticated ? (
            <div className="flex justify-center gap-4 text-xs font-mono uppercase tracking-wide text-ink/60 mt-4">
              <button
                onClick={() => navigate('/history')}
                className="underline decoration-saffron decoration-2 underline-offset-4 hover:text-ink"
              >
                Order History
              </button>
              <span className="text-ink/30">|</span>
              <button
                onClick={logout}
                className="underline decoration-paprika decoration-2 underline-offset-4 hover:text-ink"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex justify-center gap-2 text-sm text-ink/60 mt-4">
              <span>Already have an account?</span>
              <button
                onClick={() => navigate('/login')}
                className="text-paprika font-semibold underline underline-offset-2"
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured dishes */}
      <div className="px-6 pb-12">
        <div className="flex items-baseline justify-between max-w-md mx-auto mb-4">
          <h2 className="font-display text-2xl font-semibold text-ink">Chef's Picks</h2>
          <span className="font-mono text-xs uppercase tracking-wide text-ink/50">
            Today
          </span>
        </div>

        {loading ? (
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-ink/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
            {dishesToShow.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate('/scan')}
                className="text-left bg-whitewash rounded-xl overflow-hidden border border-ink/10 hover:shadow-md transition"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-24 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-3">
                  <h3 className="font-medium text-sm text-ink truncate">{item.name}</h3>
                  <p className="text-xs text-ink/60 mt-0.5">{item.price.toFixed(2)} TND</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <TileStrip color="#123C4E" />
    </div>
  );
}