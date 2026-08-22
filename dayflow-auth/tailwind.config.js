/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dayflow brand palette — a "sunrise" system: the workday
        // beginning (check-in) rendered as dusk-to-dawn color.
        ink: "#171923",       // near-black, dusk panel background
        dusk: "#3B2E5A",      // deep plum, dusk mid-tone
        coral: "#FF6B5B",     // sunrise coral — primary action color
        gold: "#FFB84D",      // warm gold — secondary accent
        paper: "#FAF7F5",     // warm off-white, light-mode surface
        slate: {
          50: "#F7F7F8",
          100: "#EDEDF2",
          400: "#9A9AA8",
          500: "#6B6B7B",
          700: "#3C3C4A",
          900: "#1C1C24",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        horizon:
          "linear-gradient(180deg, #171923 0%, #3B2E5A 45%, #FF6B5B 82%, #FFB84D 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,25,35,0.04), 0 8px 24px -6px rgba(23,25,35,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
