/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'primary': '#1d4ed8',
        'secondary': '#9333ea',
      },
    },
  },
  plugins: [],
};