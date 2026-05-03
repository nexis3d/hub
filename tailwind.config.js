/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: { 900: '#030008', 800: '#0a0a0f', 700: '#12121a', 950: '#010003' }
      },
      fontFamily: { 
        sans: ['Fira Sans', 'sans-serif'], 
        heading: ['Fira Sans', 'sans-serif'], 
        ui: ['Fira Sans', 'sans-serif'], 
      },
      animation: { 
        'modal-pop': 'modal-pop 0.3s ease-out forwards', 
        'toast-slide': 'toast-slide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', 
        'float-slow': 'float-slow 6s ease-in-out infinite', 
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', 
      },
      keyframes: {
        'modal-pop': { 
          '0%': { opacity: '0', transform: 'scale(0.95)' }, 
          '100%': { opacity: '1', transform: 'scale(1)' }, 
        },
        'toast-slide': { 
          '0%': { opacity: '0', transform: 'translateY(100%) scale(0.9)' }, 
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }, 
        },
        'float-slow': { 
          '0%, 100%': { transform: 'translateY(0px)' }, 
          '50%': { transform: 'translateY(-15px)' }, 
        }
      }
    }
  },
  plugins: [],
}