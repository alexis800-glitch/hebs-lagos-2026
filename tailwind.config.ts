import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d0d0d",
        "bg-card": "#161616",
        "hebs-purple": "#9b59b6",
        "hebs-pink": "#e91e8c",
        subtext: "#aaaaaa",
        neutral: {
          950: "#050505",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
      boxShadow: {
        // Wipe every Tailwind shadow preset that uses spread/color tricks.
        // All elevation is expressed through borders, not drop-shadows.
        none: "none",
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      dropShadow: {
        // No soft coloured drop-shadows at all.
        none: "0 0 #0000",
        sm: "0 0 #0000",
        DEFAULT: "0 0 #0000",
        md: "0 0 #0000",
        lg: "0 0 #0000",
        xl: "0 0 #0000",
        "2xl": "0 0 #0000",
      },
    },
  },
  plugins: [],
};
export default config;
