/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cairn Brand Colors
        brand: {
          50: '#F0FFFE',
          100: '#CCFEF7',
          200: '#99FDF0',
          300: '#5EFCE8',
          400: '#2CF5DD',
          500: '#00F5C0',
          600: '#00D4A3',
          700: '#00A67F',
          800: '#00785C',
          900: '#004A39',
        },
        // Light theme colors
        bg: '#F9FAFB',
        surface: '#f8fafc',
        ink: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#6C757D',
          500: '#495057',
          600: '#343A40',
          700: '#26323A',
          800: '#1D252B',
          900: '#14191D',
        },
        line: '#E5E7EB',
        // Dark theme colors
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-border': '#334155',
        'dark-text': '#f1f5f9',
        'dark-text-muted': '#94a3b8',
        'dark-text-subtle': '#64748b',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
