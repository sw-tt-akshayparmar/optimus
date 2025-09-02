/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/*.{js,ts,jsx,tsx}",
    "./app/components/*.{js,ts,jsx,tsx}",
    "./app/routes/*.{js,ts,jsx,tsx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}", // include PrimeReact
  ],
  theme: {
    extend: {
      colors: {
        // bind to PrimeReact md-dark-indigo CSS vars
        primary: "var(--primary-color)", // main accent
        "primary-hover": "var(--primary-color-hover)",
        "primary-contrast": "var(--primary-color-text)",

        surface: "var(--surface-0)", // main surface background
        "surface-100": "var(--surface-100)",
        "surface-200": "var(--surface-200)",
        "surface-300": "var(--surface-300)",
        "surface-400": "var(--surface-400)",
        "surface-500": "var(--surface-500)",
        "surface-600": "var(--surface-600)",
        "surface-700": "var(--surface-700)",
        "surface-800": "var(--surface-800)",
        "surface-900": "var(--surface-900)",

        text: "var(--text-color)", // default text
        "text-secondary": "var(--text-color-secondary)",
        border: "var(--surface-border)",

        // optional: keep your custom aliases
        card: "var(--surface-800)",
        cardDark: "var(--surface-900)",
        chatInput: "var(--surface-900)",
        chatInputBorder: "var(--surface-border)",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "0.98rem",
        base: "1.05rem",
        lg: "1.15rem",
        xl: "1.8rem",
        xxl: "2.5rem",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "6px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        DEFAULT: "0 4px 8px rgba(0,0,0,0.5)",
        card: "0 2px 12px #0008",
        cardDark: "0 1px 4px #0002",
        nav: "0 2px 12px #000a",
        btn: "0 4px 24px #2563eb44, 0 1.5px 6px #0002",
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
        "4xl": "4rem",
      },
      keyframes: {
        "gradient-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        spin1: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.6)" },
          "100%": { transform: "scale(1)" },
        },
        "border-gradient-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "gradient-move": "gradient-move 3s ease-in-out infinite",
        spin: "spin 0.6s infinite ease-in-out",
        spin1: "spin1 0.6s infinite ease-in-out",
        "border-gradient-move": "border-gradient-move 6s linear infinite",
      },
    },
  },
  plugins: [],
};
