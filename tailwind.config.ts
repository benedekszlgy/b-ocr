import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#faf8f5',
          100: '#f5f1e8',
          200: '#e8e0d0',
          300: '#d4c8b0',
          400: '#c0b090',
          500: '#a89878',
          600: '#8b7a5e',
          700: '#6e5f4a',
          800: '#514438',
          900: '#3a2f28',
        },
        teal: {
          50: '#f0f7f7',
          100: '#d9eded',
          200: '#b3dbdb',
          300: '#8cc9c9',
          400: '#66b7b7',
          500: '#4a8b87',
          600: '#3d7370',
          700: '#2f5a57',
          800: '#22413f',
          900: '#152928',
        },
      },
    },
  },
  plugins: [],
};

export default config;
