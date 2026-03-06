/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#38e07b",
        "background-light": "#f6f8f7",
        "background-dark": "#000000",
        "slate-800": "#1e293b",
        "slate-700": "#334155",
        "slate-400": "#94a3b8",
        "slate-200": "#e2e8f0",
        "slate-50": "#f8fafc",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
