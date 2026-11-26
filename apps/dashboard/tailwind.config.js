/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-black': '#000000',
        'surface': '#111111',
        'surface-inset': '#1a1a1a',
        'surface-hover': '#222222',
        'surface-selected': '#2a2a2a',
      },
    },
  },
  plugins: [],
};
