/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        sage: {
          50: '#f6f7f4',
          100: '#e8ebe3',
          200: '#d2d9c8',
          300: '#b3c0a3',
          400: '#94a67f',
          500: '#768a62',
          600: '#5c6e4d',
          700: '#49573f',
          800: '#3d4736',
          900: '#343c2f',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f9f4eb',
          200: '#f2e8d5',
        },
        terracotta: {
          400: '#d4846a',
          500: '#c4684a',
          600: '#a8543a',
        },
      },
    },
  },
  plugins: [],
};
