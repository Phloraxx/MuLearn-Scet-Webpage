/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        typewriter: "typewriter 2s steps(11) forwards",
        float: "float 6s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        typewriter: {
          to: {
            left: "100%"
          }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" }
        }
      },
      fontSize: {
        '10xl': '8rem',
        '11xl': '10rem',
        '12xl': '12rem',
      },
      spacing: {
        '120': '30rem',
        '144': '36rem',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: []
}