/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          primary: '#2563EB',
          accent: '#14B8A6',
        },
        neutralDark: '#111827',
        neutralText: '#6B7280',
        // Apple blue tones
        'apple-blue': {
          light: '#5AC8FA',
          DEFAULT: '#007AFF',
          dark: '#0040DD',
        },
        // Apple neutrals
        'apple': {
          'black': '#1D1D1F',
          'gray': '#86868B',
          'light-gray': '#F5F5F7',
        },
        // Gradient colors for 3D backgrounds
        'grad-start': '#6B46C1',
        'grad-mid': '#2C5282',
        'grad-end': '#319795',
        // New design system colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        'inter': ['var(--font-inter)'],
        'inter-tight': ['var(--font-inter-tight)'],
      },
      backgroundImage: {
        'apple-gradient': 'radial-gradient(50% 50% at 50% 50%, rgba(90, 200, 250, 0.05) 0%, rgba(0, 122, 255, 0.05) 100%)',
        'hero-gradient': 'linear-gradient(160deg, #0071e3 0%, #42a1ec 50%, #00a1ff 100%)',
        'glow-gradient': 'linear-gradient(to right, #4f46e5, #8b5cf6, #ec4899)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'apple-button': '0 3px 10px rgba(0, 0, 0, 0.1)',
        'apple-card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03), 0 -1px 2px -1px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'inner-glow': 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob-bounce 7s infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'blob-bounce': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(10px, -10px) scale(1.05)' },
          '50%': { transform: 'translate(0, 20px) scale(0.95)' },
          '75%': { transform: 'translate(-10px, -15px) scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
      },
    },
  },
  plugins: [],
} 