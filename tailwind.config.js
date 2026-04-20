export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
extend: {
  scrollBehavior: ['responsive'],
  colors: {
    cyberred: "#DC3D50",
    cyberviolet: "#473C59",
  },
  fontFamily: {
    montserrat: ['Montserrat', 'sans-serif'],
  },
  keyframes: {
    marquee: {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' },
    },
  },
  animation: {
    marquee: 'marquee 35s linear infinite',
  },
},

  },
  plugins: [],
}
