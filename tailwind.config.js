/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0079bf",
        "primary-light": "#00a2e0",
        "primary-dark": "#006aa8",
        secondary: "#ff9f1a",
        "secondary-light": "#ffab4a",
        "secondary-dark": "#ff8b00",
        success: "#61bd4f",
        "success-dark": "#51a63d",
        info: "#f2d600",
        warning: "#eb5a46",
        "warning-dark": "#d04632",
        bg: "#f4f5f7",
        text: "#172b4d",
        "text-light": "#6b778c",
        border: "#dfe1e6",
      },
    },
  },
  plugins: [],
};
