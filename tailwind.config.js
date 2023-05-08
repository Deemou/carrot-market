/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
    screens: {
      w320: '320px',
      w480: '480px',
      w640: '640px',
      w768: '768px',
      w1024: '1024px',
      w1280: '1280px',
      w1536: '1536px'
    }
  },
  darkMode: 'media', // class
  plugins: [require('@tailwindcss/forms')]
};
