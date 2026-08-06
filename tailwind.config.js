/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Strict Design System Colors
        burgundy: {
          50: '#FDF4F8',
          100: '#F9E6F0',
          200: '#F3CFE2',
          300: '#E8AACD',
          400: '#D57BAF',
          500: '#B54988',
          600: '#94326D',
          700: '#6D214F', // Primary Deep Burgundy
          800: '#581C41',
          900: '#461A36',
          950: '#2A0C1F',
        },
        bronze: {
          50: '#FBF8F5',
          100: '#F4ECE4',
          200: '#E6D7C7',
          300: '#D4BFA7',
          400: '#BC9F82',
          500: '#A18063',
          600: '#8E6C4D', // Warm Bronze
          700: '#73553A',
          800: '#5B422D',
          900: '#483424',
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
        warmwhite: '#FAF9F6',
        cardbg: '#FFFFFF',
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#666666', // Secondary Text
          600: '#555555',
          700: '#444444',
          800: '#333333',
          900: '#222222', // Primary Text
          950: '#141414',
        },
        subtleborder: '#ECECEC',
        // Backwards compatibility mappings to prevent missing color crashes
        maroon: {
          50: '#FDF4F8',
          100: '#F9E6F0',
          500: '#94326D',
          700: '#6D214F',
          800: '#581C41',
          900: '#461A36',
          950: '#2A0C1F',
        },
        rosegold: {
          50: '#FBF8F5',
          300: '#D4BFA7',
          500: '#8E6C4D',
          700: '#73553A',
          900: '#483424',
        },
        beige: {
          50: '#FAF9F6',
          100: '#F4ECE4',
          200: '#ECECEC',
          300: '#D1D1D1',
        },
        purple: {
          50: '#FDF4F8',
          700: '#6D214F',
          900: '#461A36',
          950: '#2A0C1F',
        },
        pink: {
          500: '#8E6C4D',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Poppins', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 30px rgba(109, 33, 79, 0.08)',
        'luxury': '0 15px 35px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
