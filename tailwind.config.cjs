/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Rethink Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        mavro: {
          green: '#00662B',
          dark: '#003D1A',
          cream: '#F5F2EA',
          'cream-dark': '#EBE7DC',
          text: '#1A2D1F',
        },
      },
    },
  },
  plugins: [],
}
