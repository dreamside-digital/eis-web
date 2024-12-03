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
        highlight: '#584963', // aubergine
        beige: "#E8DED3", // bone
        navy: '#22365B',
        lavendar: '#E2E5F8',
        aubergine: '#584963',
        orange: '#EE5D0F',
        pink: '#F094B2',
        latte: '#C7B3A8'
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      }
    },
  },
  plugins: [],
};