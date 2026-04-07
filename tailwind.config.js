/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "petrol-blue": "#0F4C5C",
        "petrol-blue-deep": "#0A3540",
        "petrol-blue-soft": "#D7EBEF",
        "sky-mist": "#F2F8FA",
        success: "#1D9A6C",
        warning: "#D1912A",
        danger: "#CE3E4A",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 76, 92, 0.10)",
        glass: "0 8px 28px rgba(15, 76, 92, 0.16)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(at 20% 20%, rgba(15,76,92,.14) 0px, transparent 42%), radial-gradient(at 80% 30%, rgba(0,146,199,.12) 0px, transparent 38%), radial-gradient(at 50% 80%, rgba(15,76,92,.08) 0px, transparent 40%)",
      },
      keyframes: {
        "fade-slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-slide-up": "fade-slide-up .6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
