/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9ec',
          100: '#faf0cc',
          200: '#f4de94',
          300: '#edc85c',
          400: '#e5af32',
          500: '#C9A84C',
          600: '#b8892e',
          700: '#996921',
          800: '#7d5120',
          900: '#68421f',
        },
        purple: {
          50: '#f3f0ff',
          100: '#e9e2ff',
          200: '#d6c8ff',
          300: '#b8a0ff',
          400: '#9470ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2D1B69',
          950: '#1a0f3d',
        },
        pink: {
          400: '#f472b6',
          500: '#E91E8C',
          600: '#c2185b',
          700: '#ad1457',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A84C, #f4de94, #C9A84C)',
        'gradient-royal': 'linear-gradient(135deg, #2D1B69, #E91E8C)',
        'gradient-dark': 'linear-gradient(135deg, #0a0512, #1a0f3d)',
        'gradient-hero': 'linear-gradient(135deg, #0a0512 0%, #2D1B69 50%, #1a0a2e 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201, 168, 76, 0.3)',
        'gold-lg': '0 0 40px rgba(201, 168, 76, 0.4)',
        'pink': '0 0 20px rgba(233, 30, 140, 0.3)',
        'purple': '0 0 20px rgba(45, 27, 105, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(201, 168, 76, 0.8)' },
        },
        glow: {
          from: { textShadow: '0 0 10px #C9A84C, 0 0 20px #C9A84C' },
          to: { textShadow: '0 0 20px #C9A84C, 0 0 40px #C9A84C, 0 0 60px #E91E8C' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
