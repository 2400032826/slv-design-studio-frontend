/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Strictly Monochrome + Luxury Gold Color System
        black: '#000000',
        charcoal: {
          900: '#111111', // Primary Text
          800: '#1F1F1F',
          700: '#333333',
          600: '#555555',
          500: '#666666', // Secondary Text
          400: '#888888',
          300: '#AAAAAA',
          200: '#CCCCCC',
          100: '#EAEAEA', // Borders
          50: '#F8F8F8',  // Secondary Background
        },
        gold: {
          50: '#FDFBF2',
          100: '#F9F4DF',
          200: '#F3E6B7',
          300: '#EBD387',
          400: '#E2BF5A',
          500: '#D4AF37', // Luxury Gold Accent
          600: '#B28C28',
          700: '#8C6B1D',
          800: '#664D15',
          900: '#4D390F',
        },
        // Backwards compatibility mappings for smooth migration
        maroon: {
          50: '#F8F8F8',
          100: '#EAEAEA',
          500: '#000000',
          700: '#000000',
          800: '#111111',
          900: '#111111',
          950: '#000000',
        },
        burgundy: {
          50: '#F8F8F8',
          100: '#EAEAEA',
          700: '#000000',
          800: '#111111',
          900: '#111111',
          950: '#000000',
        },
        rosegold: {
          500: '#D4AF37',
        },
        bronze: {
          500: '#D4AF37',
          600: '#D4AF37',
        },
        beige: {
          50: '#FFFFFF',
          100: '#F8F8F8',
          200: '#EAEAEA',
        },
        purple: {
          700: '#000000',
          900: '#111111',
          950: '#000000',
        },
        pink: {
          500: '#D4AF37',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.08)',
        'gold': '0 4px 15px rgba(212, 175, 55, 0.2)',
      },
    },
  },
  plugins: [],
}
