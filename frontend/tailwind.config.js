/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf5ff',
          100: '#dbeaff',
          200: '#bcd6ff',
          300: '#8fb8ff',
          400: '#5a8eff',
          500: '#3461ff',
          600: '#2644ff',
          700: '#2036eb',
          800: '#1f2fbf',
          900: '#0a1150',
        },
        dark: {
          100: '#1e2233',
          200: '#171a29', 
          300: '#12141f',
          400: '#0c0e17',
          500: '#070810',
        },
        space: {
          purple: '#9d4edd',
          blue: '#3a86ff',
          teal: '#00f5d4',
          pink: '#ff49db',
          indigo: '#5e60ce',
        }
      },
    },
  },
  plugins: [],
} 