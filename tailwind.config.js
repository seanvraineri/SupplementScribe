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
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#90cffc',
          400: '#5eb5f9',
          500: '#3b96f5',
          600: '#2577e8',
          700: '#1c63d6',
          800: '#1c51af',
          900: '#1c4689',
          950: '#142c54',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        }
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
        'gradient-sidebar': 'linear-gradient(to bottom, rgb(15, 23, 42), rgb(49, 46, 129))',
        'gradient-card': 'linear-gradient(to right, rgb(243, 244, 246), rgb(249, 250, 251))',
        'gradient-primary': 'linear-gradient(to right, rgb(59, 130, 246), rgb(124, 58, 237))',
        'gradient-success': 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
        'gradient-warning': 'linear-gradient(to right, rgb(249, 115, 22), rgb(234, 179, 8))',
        'gradient-danger': 'linear-gradient(to right, rgb(239, 68, 68), rgb(244, 114, 182))',
      },
      boxShadow: {
        'apple-button': '0 3px 10px rgba(0, 0, 0, 0.1)',
        'apple-card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 25px 0px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 40px 0px rgba(0, 0, 0, 0.1)',
        'sidebar': '4px 0 25px rgba(0, 0, 0, 0.1)',
        'metric': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'metric-hover': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'blob': 'blob-bounce 7s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
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