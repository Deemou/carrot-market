/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', '@components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  darkMode: 'media', // class
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/forms')]
};
