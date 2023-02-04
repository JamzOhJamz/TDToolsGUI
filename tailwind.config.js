/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8296ff",
        error: "#f56c6c",
        success: "#74E39A",
        gray: {
          100: "#B0B3B8",
          200: "#E4E6EB",
          300: "#3A3B3C",
          400: "#242526",
          500: "#18191A",
        }
      }
    },
  },
  plugins: [],
}
