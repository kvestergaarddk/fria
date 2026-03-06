/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c6d7c5',
          300: '#9dba9c',
          400: '#7a9e78',
          500: '#5c7a5a',
          600: '#4a6449',
          700: '#3d5239',
          800: '#33432f',
          900: '#2b3828',
        },
        cream: {
          50: '#fdfaf5',
          100: '#f9f6f0',
          200: '#f4f1eb',
          300: '#ece7de',
          400: '#ddd5c7',
        },
        forest: '#1a2318',
        tan: '#c4a882',
      },
      letterSpacing: {
        tighter: '-0.03em',
      },
      lineHeight: {
        relaxed: '1.7',
      },
    },
  },
  plugins: [],
}
