/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      body: ['Poppins', 'Helvetica Neue', 'sans-serif'],
      title: ['var(--font-title)', 'Georgia', 'serif'],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#E2E5F8', // lavendar
        secondary: "#C7B3A8", // beige
        dark: '#223659', // navy
        light: '#f6f2ed', // off-white
        medium: '#B8D0CA', // mint
        highlight: '#f08372', // pink
        beige: "#E8DED3", // bone
        navy: '#22365B',
        lavendar: '#E2E5F8',
        aubergine: '#584963',
        orange: '#EE5D0F',
        pink: '#f08372',
        latte: '#C7B3A8',
        grey: '#b2b2b2'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
};