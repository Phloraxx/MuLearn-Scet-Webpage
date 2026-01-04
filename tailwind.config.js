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
      },
      colors: {
        primary: "#7C7CE0", 
        secondary: "#1A202C", 
        "retro-gray": "#D1D5DB", 
        "screen-blue": "#283E56", 
        "background-light": "#E5E5E5", 
        "background-dark": "#111827", 
        "accent-dark": "#0F172A",
      },
      fontFamily: {
        display: ["'Anton'", "sans-serif"],
        retro: ["'Bebas Neue'", "cursive"],
        mono: ["'Share Tech Mono'", "monospace"],
        tech: ["'Orbitron'", "sans-serif"],
        handwritten: ["'Special Elite'", "cursive"],
      },
      backgroundImage: {
        'grunge-pattern': "url('https://www.transparenttextures.com/patterns/concrete-wall.png')",
        'noise': "url('https://www.transparenttextures.com/patterns/stardust.png')",
      },
      boxShadow: {
        'tv': '0 0 20px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.8)',
        'screen-glow': '0 0 15px rgba(124, 124, 224, 0.3)',
      }
    },
  },
  darkMode: "class",
  plugins: []
}