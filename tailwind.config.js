/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern E-commerce Pink Brand System
        fashion: {
          bg: '#F5F7FA',
          'bg-alt': '#F7F8FC',
          surface: '#FFFFFF',
          'pink-light': '#FCE7F3',
          'pink-section': '#FFF5F9',
          pink: '#EC4899',
          'pink-hover': '#DB2777',
          magenta: '#C026D3',
          'pink-deep': '#BE185D',
          dark: '#1F2937',
          secondary: '#64748B',
          border: '#E5E7EB',
          'border-light': '#F3F4F6',
        },
        pink: {
          50: '#FFF5F9',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899', // Primary Brand Color
          600: '#DB2777', // Primary Hover
          700: '#BE185D', // Deep Pink Accent
          800: '#9D174D',
          900: '#831843',
        },
        magenta: {
          50: '#FDF4FF',
          100: '#FAE8FF',
          200: '#F5D0FE',
          300: '#F0ABFC',
          400: '#E879F9',
          500: '#D946EF',
          600: '#C026D3', // Premium Magenta
          700: '#A21CAF',
          800: '#86198F',
          900: '#701A75',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Secondary Text
          600: '#475569',
          700: '#334155',
          800: '#1F2937', // Dark Text
          900: '#111827',
        },
        charcoal: {
          900: '#1F2937',
          800: '#334155',
          700: '#475569',
          600: '#64748B',
          500: '#94A3B8',
          400: '#CBD5E1',
          300: '#E5E7EB',
          200: '#F3F4F6',
          100: '#F5F7FA',
          50: '#FFFFFF',
        },
        // Backwards compatibility mappings
        maroon: {
          50: '#FFF5F9',
          100: '#FCE7F3',
          500: '#EC4899',
          700: '#DB2777',
          800: '#BE185D',
          900: '#1F2937',
        },
        burgundy: {
          50: '#FFF5F9',
          100: '#FCE7F3',
          700: '#DB2777',
          800: '#BE185D',
          900: '#1F2937',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        beige: {
          50: '#FFFFFF',
          100: '#F5F7FA',
          200: '#E5E7EB',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(31, 41, 55, 0.06)',
        'card': '0 2px 12px rgba(31, 41, 55, 0.05)',
        'card-hover': '0 10px 25px rgba(236, 72, 153, 0.12)',
        'pink-glow': '0 0 20px rgba(236, 72, 153, 0.3)',
        'subtle': '0 1px 4px rgba(31, 41, 55, 0.04)',
        'gold': '0 4px 15px rgba(245, 158, 11, 0.25)',
        'pink': '0 4px 16px rgba(236, 72, 153, 0.25)',
        'magenta': '0 4px 16px rgba(192, 38, 211, 0.25)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #EC4899 0%, #C026D3 100%)',
        'gradient-hover': 'linear-gradient(135deg, #DB2777 0%, #A21CAF 100%)',
        'gradient-soft': 'linear-gradient(135deg, #F5F7FA 0%, #FFF5F9 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 50%, #FFF5F9 100%)',
        'gradient-royal': 'linear-gradient(135deg, #EC4899 0%, #C026D3 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
      },
    },
  },
  plugins: [],
}
