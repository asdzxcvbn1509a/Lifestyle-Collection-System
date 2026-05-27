/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0faf3',
          100: '#dcf2e3',
          200: '#bae3c9',
          300: '#8bcfa6',
          400: '#54b27e',
          500: '#2f9e63',
          600: '#218551',
          700: '#1c6a43',
          800: '#185437',
          900: '#13442e',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 4px 16px -4px rgb(0 0 0 / 0.08)',
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 10px 28px -8px rgb(0 0 0 / 0.12)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scaleIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.15s ease-out',
        scaleIn: 'scaleIn 0.18s ease-out',
      },
    },
  },
  plugins: [],
};
