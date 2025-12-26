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
        // KAVOSZ Design System Colors
        kavosz: {
          bg: '#f7f8fa',
          'teal-primary': '#0d9488',
          'teal-hover': '#0f766e',
          'teal-light': '#e6f7f6',
          border: '#e5e7eb',
          'text-primary': '#111827',
          'text-secondary': '#374151',
          'text-muted': '#6b7280',
          'text-light': '#9ca3af',
        },
      },
      boxShadow: {
        'kavosz': '0 1px 3px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
