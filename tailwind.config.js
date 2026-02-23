/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        primaryLight: '#dbeafe',
        primaryDark: '#1e40af',
        secondary: '#8b5cf6',
        accent: '#f97316',
        surface: '#ffffff',
        'surface-alt': '#f8fafc',
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        'border-light': '#e2e8f0',
      },
      boxShadow: {
        'sm-soft': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'md-soft': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg-soft': '0 10px 15px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
