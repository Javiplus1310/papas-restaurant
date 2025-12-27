/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D61C27', // rojo principal
          dark: '#A21620'
        },
        accent: {
          DEFAULT: '#FFC300' // amarillo
        },
        paper: '#0b0b0b'
      }
    }
  },
  plugins: []
}