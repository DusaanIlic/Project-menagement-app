/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter']
      },
      colors: {
        "accent-blue": "#0E2954",
        "background": "#EBF3FF"
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

