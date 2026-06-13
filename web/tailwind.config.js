/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'hex-primary': '#FF6B35',
        'hex-secondary': '#1A1A2E',
        'hex-accent': '#E94560',
        'hex-gold': '#F5A623',
        'hex-green': '#27AE60',
        'hex-dark': '#0F0F1A',
        'hex-light': '#F8F9FA',
        'hex-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hex-gradient': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
        'hex-hero': 'linear-gradient(135deg, #1A1A2E 0%, #E94560 50%, #FF6B35 100%)',
        'hex-card': 'linear-gradient(145deg, #1E1E35 0%, #252540 100%)',
      },
      animation: {
        'count-up': 'countUp 2s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'hex': '0 4px 24px rgba(255, 107, 53, 0.15)',
        'hex-lg': '0 8px 48px rgba(255, 107, 53, 0.25)',
        'hex-gold': '0 4px 24px rgba(245, 166, 35, 0.2)',
      },
    },
  },
  plugins: [],
};
