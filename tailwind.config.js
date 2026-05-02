/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: 'rgb(255 255 255 / <alpha-value>)', 
        black: 'rgb(0 0 0 / <alpha-value>)',
        slate: { 
          50: 'rgb(248 250 252 / <alpha-value>)', 
          800: 'rgb(30 41 59 / <alpha-value>)', 
          900: 'rgb(15 23 42 / <alpha-value>)', 
          950: 'rgb(2 6 23 / <alpha-value>)', 
        },
        indigo: { 
          300: 'rgb(165 180 252 / <alpha-value>)', 
          400: 'rgb(129 140 248 / <alpha-value>)', 
          500: 'rgb(99 102 241 / <alpha-value>)', 
          600: 'rgb(79 70 229 / <alpha-value>)', 
        }
      },
      fontFamily: { 
        sans: ['Fira Sans', 'sans-serif'], 
        heading: ['Fira Sans', 'sans-serif'], 
        ui: ['Fira Sans', 'sans-serif'], 
      },
      animation: { 
        blob: 'blob 25s infinite ease-in-out', 
        'gradient-x': 'gradient-x 5s ease infinite', 
        'modal-pop': 'modal-pop 0.3s ease-out forwards', 
        'toast-slide': 'toast-slide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', 
      },
      keyframes: {
        blob: { 
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' }, 
          '33%': { transform: 'translate(150px, -150px) scale(1.2)' }, 
          '66%': { transform: 'translate(-120px, 120px) scale(0.8)' }, 
        },
        'gradient-x': { 
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' }, 
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' }, 
        },
        'modal-pop': { 
          '0%': { opacity: '0', transform: 'scale(0.95)' }, 
          '100%': { opacity: '1', transform: 'scale(1)' }, 
        },
        'toast-slide': { 
          '0%': { opacity: '0', transform: 'translateY(100%) scale(0.9)' }, 
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }, 
        }
      }
    }
  },
  plugins: [],
}
