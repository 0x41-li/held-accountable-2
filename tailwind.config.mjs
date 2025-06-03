/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "tertiary-600": "#475467",
        "blue": "#3B88E3",
        "subyellow": "#FFCC00"
      },
      borderColor: {
        primary: "#D0D5DD",
        secondary: "#E4E7EC",
        "subprimary": "#D5D7DA",
      }
    },
  },
  plugins: [],
};
