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
      keyframes: {
        glow: {
          '0%, 100%': {
            opacity: '0.5',
          },
          '50%': {
            opacity: '1',
          },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        glow: 'glow 1.6s ease-in-out infinite',
        loadingBar: 'loadingBar 1.5s linear infinite',
      },
    },
  },
  plugins: [],
}
