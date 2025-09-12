/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/*.{js,ts,jsx,tsx}",
    "./app/components/*.{js,ts,jsx,tsx}",
    "./app/routes/*.{js,ts,jsx,tsx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          a: '#1f2937',
          b: '#111827',
          c: 'rgba(255,255,255,0.03)',
          d: '#424b57',
          e: '#1f2937',
          f: '#1f2937',
        },
        text: {
          DEFAULT: 'rgba(255,255,255,0.87)',
          secondary: 'rgba(255,255,255,0.6)',
        },
        primary: {
          DEFAULT: '#22d3ee',
          50: '#f4fdfe',
          100: '#caf4fb',
          200: '#a0ecf8',
          300: '#76e4f4',
          400: '#4cdbf1',
          500: '#22d3ee',
          600: '#1db3ca',
          700: '#1894a7',
          800: '#137483',
          900: '#0e545f',
        },
        error: '#fca5a5',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        accent: '#6366f1',
        success: '#22c55e',
        warning: '#eab308',
        info: '#3b82f6',
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '6px',
        lg: '12px',
        full: '9999px',
      },
      fontFamily: {
        inter: ['Inter var', 'sans-serif'],
      },
      spacing: {
        'content': '1.25rem',
        'inline': '0.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
