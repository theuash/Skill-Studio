/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#DFD3B5',
          primary: '#44444E',
          secondary: '#6C6E36',
          surface: '#F5F1E8',
          border: '#E8DCC8',
        },
        dark: {
          bg: '#37353E',
          primary: '#DFD3B5',
          secondary: '#D3DAD9',
          surface: '#3F3D47',
          border: '#4A484F',
        },
        accent: '#44444E',
        secondary: '#6C6E36',
      },
      fontFamily: {
        heading: ['Inter', 'Segoe UI', 'sans-serif'],
        body: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out infinite 1s',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'scale-pulse': 'scaleup 2.5s ease-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        scaleup: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.05)', opacity: '0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
