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
        light: {
          primary: '#1e3a8a',
          secondary: '#10B981',
          accent: '#8B5CF6',
          background: '#F8FAFC',
          surface: '#FFFFFF',
          text: '#0F172A',
          textSecondary: '#475569',
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        dark: {
          primary: '#60A5FA',
          secondary: '#34D399',
          accent: '#A78BFA',
          background: '#1F2937',
          surface: '#374151',
          text: '#F9FAFB',
          textSecondary: '#D1D5DB',
          border: '#4B5563',
          success: '#34D399',
          warning: '#FBBF24',
          error: '#F87171',
          info: '#60A5FA',
        },
      },
    },
  },
  plugins: [],
}
