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
          green: '#204636',
          dark: '#1B3A28',
          bg: '#BFCEA3',
          chip: '#A5B98C',
          text: '#1B3A28',
        },
      },
    },
  },
  plugins: [],
}
