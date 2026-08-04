import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/");
    } catch {
      // error already set in context
    }
  };

  return (
    <div className="min-h-screen bg-noir flex flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold text-linen mb-6"
      >
        Create Account
      </motion.h1>

      <motion.form
        variants={container}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-4"
      >
        <motion.input
          variants={item}
          whileFocus={{ scale: 1.02, borderColor: "#FF8A3D" }}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-charcoal border border-gold/20 text-linen placeholder-smoke rounded-lg px-4 py-3 focus:outline-none transition-colors"
          required
        />
        <motion.input
          variants={item}
          whileFocus={{ scale: 1.02, borderColor: "#FF8A3D" }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-charcoal border border-gold/20 text-linen placeholder-smoke rounded-lg px-4 py-3 focus:outline-none transition-colors"
          required
        />
        <motion.input
          variants={item}
          whileFocus={{ scale: 1.02, borderColor: "#FF8A3D" }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-charcoal border border-gold/20 text-linen placeholder-smoke rounded-lg px-4 py-3 focus:outline-none transition-colors"
          required
        />

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rust text-sm">
            {error}
          </motion.p>
        )}

        <motion.button
          variants={item}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          type="submit"
          disabled={loading}
          className="bg-gold text-noir py-3 rounded-lg font-semibold hover:brightness-110 active:brightness-95 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && (
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
              <Loader2 size={18} strokeWidth={2} />
            </motion.span>
          )}
          {loading ? "Creating account..." : "Register"}
        </motion.button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-smoke mt-4"
      >
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-gold font-medium underline underline-offset-2"
        >
          Log in
        </button>
      </motion.p>
    </div>
  );
}