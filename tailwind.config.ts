import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF2CC',
          200: '#FFE699',
          300: '#FFD966',
          400: '#FFCC33',
          500: '#FFD700',
          600: '#DAA520',
          700: '#B8860B',
          800: '#8B6914',
          900: '#5E4510',
        },
        emerald: {
          50: '#E0F5E9',
          100: '#C1EBD3',
          200: '#A2E1BD',
          300: '#83D7A7',
          400: '#50C878',
          500: '#2E8B57',
          600: '#267349',
          700: '#1E5B3B',
          800: '#16432D',
          900: '#0E2B1F',
        },
        teal: {
          50: '#E0F5F5',
          100: '#B3E5E5',
          200: '#80D4D4',
          300: '#4DC4C4',
          400: '#26B3B3',
          500: '#008080',
          600: '#006666',
          700: '#004D4D',
          800: '#003333',
          900: '#001A1A',
        },
        cream: {
          50: '#FFFDF7',
          100: '#FFF8E7',
          200: '#FFF3D6',
          300: '#FFEDC6',
          400: '#FFE8B5',
          500: '#FAF0DC',
        },
      },
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
