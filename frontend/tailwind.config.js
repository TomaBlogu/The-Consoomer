import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        loud: ['Vina Sans', 'sans-serif'],
        artistic: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["lofi"],
  },
}

