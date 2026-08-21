/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF4FF",
          100: "#DBE6FE",
          200: "#BDD1FE",
          300: "#8FB3FD",
          400: "#5B8AFA",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1A3FB0",
          800: "#1B3690",
          900: "#1B3072",
        },
        secondary: {
          DEFAULT: "#0F172A",
          50: "#F5F7FA",
          100: "#E4E8EF",
          800: "#1A2438",
          900: "#0F172A",
          950: "#080D18",
        },
        accent: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
        },
        surface: "#F8FAFC",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 8px 24px -8px rgba(15, 23, 42, 0.06)",
        card: "0 1px 2px rgba(15,23,42,0.04), 0 8px 32px -12px rgba(15,23,42,0.12)",
        glow: "0 0 0 1px rgba(37,99,235,0.08), 0 12px 40px -12px rgba(37,99,235,0.35)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #2563EB 0%, #1D4ED8 60%, #10B981 140%)",
        "grad-dark": "linear-gradient(160deg, #0F172A 0%, #1A2438 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease forwards",
        shimmer: "shimmer 1.6s infinite linear",
      },
    },
  },
  plugins: [],
};
