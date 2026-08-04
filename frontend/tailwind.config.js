/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: "#0B0B14",
        charcoal: "#1B1B27",
        gold: "#FF8A3D",
        rust: "#FF4F5E",
        linen: "#F5F1E8",
        smoke: "#8D8A99",
        lime: "#B6FF5C",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      keyframes: {
        blobMove: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.15)" },
          "66%": { transform: "translate(-20px, 30px) scale(0.9)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(255,138,61,0)" },
          "50%": { boxShadow: "0 0 28px rgba(255,138,61,0.45)" },
        },
      },
      animation: {
        blob: "blobMove 14s ease-in-out infinite",
        "blob-delay": "blobMove 14s ease-in-out infinite 4s",
        glow: "glowPulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};