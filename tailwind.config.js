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
        primary: '#584963', // purple
        secondary: "#C7B3A8", // beige
        dark: '#223659', // navy
        light: '#E0E9E6', // mint cream
        medium: '#B8D0CA', // mint
        highlight: '#E3328D' // pink
      },
    },
  },
  plugins: [],
};