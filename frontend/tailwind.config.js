/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5ed', 100: '#ffe8d4', 200: '#ffcda8', 300: '#ffa970', 400: '#ff7a37',
          500: '#fc5a12', 600: '#ed4008', 700: '#c42e09', 800: '#9c2610', 900: '#7e2210',
        },
        ink: { DEFAULT: '#1c1917', soft: '#44403c', muted: '#78716c' },
        veg: '#15803d',
        nonveg: '#b91c1c',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,25,23,.05), 0 8px 24px -12px rgba(28,25,23,.18)',
        lift: '0 2px 4px rgba(28,25,23,.06), 0 18px 40px -16px rgba(28,25,23,.28)',
      },
      keyframes: {
        'fade-up': { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'none' } },
        'slide-in': { from: { opacity: 0, transform: 'translateX(12px)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up .35s cubic-bezier(.2,.8,.2,1) both',
        'slide-in': 'slide-in .25s ease both',
      },
    },
  },
  plugins: [],
};
