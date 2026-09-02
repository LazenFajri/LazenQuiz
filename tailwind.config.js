/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#6C5CE7', // Vibrant Quizzo Purple
          600: '#5842D8',
          700: '#4834D4',
          800: '#3727A6',
          900: '#281c78',
        },
        coral: {
          400: '#FF8A65',
          500: '#FF6B4A', // Gamesin warm orange/coral
          600: '#E05334',
        },
        surface: {
          base: '#F4F5FB', // Soft modern neutral background
          card: '#FFFFFF',
          dark: '#131524',
          darkcard: '#1D2038',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(108, 92, 231, 0.06)',
        'soft-md': '0 8px 24px rgba(108, 92, 231, 0.10)',
        'soft-lg': '0 16px 40px rgba(108, 92, 231, 0.14)',
        'coral-glow': '0 10px 25px rgba(255, 107, 74, 0.35)',
        'purple-glow': '0 10px 25px rgba(108, 92, 231, 0.35)',
      }
    }
  },
  plugins: []
};