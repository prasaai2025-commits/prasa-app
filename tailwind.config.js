/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prasa-green': '#008756',
        'prasa-light': '#f8faf9',
      },
    },
  },
  plugins: [],
}