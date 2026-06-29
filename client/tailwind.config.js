/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ff3b5c',
          blue: '#3b6bff',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #ff3b5c 0%, #7c3bff 50%, #3b6bff 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(255,59,92,0.18) 0%, rgba(124,59,255,0.18) 50%, rgba(59,107,255,0.18) 100%)',
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,59,92,0.35)' },
          '50%': { boxShadow: '0 0 35px rgba(59,107,255,0.5)' },
        },
      },
    },
  },
  plugins: [],
};
