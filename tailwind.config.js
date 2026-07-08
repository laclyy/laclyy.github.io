/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080706',
        panel: '#100e0c',
        ember: '#d90724',
        flame: '#ff2038',
        solar: '#ffd43b',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      boxShadow: {
        ember: '0 0 55px rgba(232, 6, 38, 0.22)',
      },
      opacity: {
        15: '.15',
        28: '.28',
        32: '.32',
        35: '.35',
        38: '.38',
        42: '.42',
        43: '.43',
        45: '.45',
        48: '.48',
        52: '.52',
        55: '.55',
        58: '.58',
        72: '.72',
        88: '.88',
      },
    },
  },
  plugins: [],
}
