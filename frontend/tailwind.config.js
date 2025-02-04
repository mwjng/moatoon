/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        scrollLeft: "scrollLeft 50s linear infinite",
        scrollRight: "scrollRight 50s linear infinite",
      },
      keyframes: {
        scrollLeft: {
          "from": { transform: "translateX(0%)" },
          "to": { transform: "translateX(-85.8%)" },
        },
        scrollRight: {
          "from": { transform: "translateX(-85.8%)" },
          "to": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

