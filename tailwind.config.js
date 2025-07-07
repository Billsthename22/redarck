// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontSize: {
          'heading-128': '128px',
        },
        fontFamily: {
          koulen: ['"Koulen"', 'sans-serif'],
          kristi: ['"Kristi"', 'cursive'],
          konkhmer: ['"Konkhmer Sleokchher"', 'cursive'],
        },
      },
    },
    plugins: [],
  }
  