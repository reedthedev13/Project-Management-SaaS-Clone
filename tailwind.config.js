export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // blue-600
        primaryDark: "#1D4ED8", // blue-700
        accent: "#FBBF24", // amber-400
        background: "#F9FAFB", // gray-50
        inputBorder: "#D1D5DB", // gray-300
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
