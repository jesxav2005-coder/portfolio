/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
      colors: {
        indigo: {
          50: 'var(--indigo-50)',
          100: 'var(--indigo-100)',
          200: 'var(--indigo-200)',
          300: 'var(--indigo-300)',
          400: 'var(--indigo-400)',
          500: 'var(--indigo-500)',
          600: 'var(--indigo-600)',
          700: 'var(--indigo-700)',
          800: 'var(--indigo-800)',
          900: 'var(--indigo-900)',
          950: 'var(--indigo-950)',
        },
        violet: {
          50: 'var(--violet-50)',
          100: 'var(--violet-100)',
          200: 'var(--violet-200)',
          300: 'var(--violet-300)',
          400: 'var(--violet-400)',
          500: 'var(--violet-500)',
          600: 'var(--violet-600)',
          700: 'var(--violet-700)',
          800: 'var(--violet-800)',
          900: 'var(--violet-900)',
          950: 'var(--violet-950)',
        },
        slate: {
          50: 'var(--slate-50)',
          100: 'var(--slate-100)',
          200: 'var(--slate-200)',
          300: 'var(--slate-300)',
          400: 'var(--slate-400)',
          500: 'var(--slate-500)',
          600: 'var(--slate-600)',
          700: 'var(--slate-700)',
          800: 'var(--slate-800)',
          900: 'var(--slate-900)',
          950: 'var(--slate-950)',
        }
      }
    },
  },
  plugins: [],
}
