/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F5F7',
        surface: '#FFFFFF',
        ink: '#1D1D1F',
        muted: '#6E6E73',
        line: 'rgba(0,0,0,0.06)',
        toma: {
          DEFAULT: '#0A84FF',
          soft: 'rgba(10,132,255,0.12)',
        },
        deja: {
          DEFAULT: '#FF9F0A',
          soft: 'rgba(255,159,10,0.14)',
        },
        good: {
          DEFAULT: '#30D158',
          soft: 'rgba(48,209,88,0.12)',
        },
        bad: {
          DEFAULT: '#FF453A',
          soft: 'rgba(255,69,58,0.12)',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'ui-rounded', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        bubble: '1.75rem',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        floating: '0 12px 32px rgba(0,0,0,0.12)',
        pressed: 'inset 0 1px 3px rgba(0,0,0,0.12)',
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.92)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pop': 'pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'float-y': 'float-y 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
