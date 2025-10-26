import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Your brand purple, with hand-tuned shades.
        // DEFAULT is used for classes like bg-primary / text-primary.
        // 600/700/800 etc. are used in gradients like from-primary-600.
        primary: {
          50:  '#f8f5f7',
          100: '#f2e6f0',
          200: '#dfc3dd',
          300: '#c397c2',
          400: '#9a5a98',
          500: '#6a1d67',
          600: '#490c3d', // your main color
          700: '#3a0a31', // your darker token
          800: '#2a0621',
          900: '#1a0314',
          DEFAULT: '#490c3d', // so bg-primary works
        },

        // Neutral surfaces / text colors you already reference as secondary-*
        secondary: colors.slate, // slate gives secondary-50 ... secondary-900

        // Accent greens you use in Metrics cards / “Online” states
        accent: colors.emerald,  // emerald-500 etc.

        // Keep your grayscale override if you're using gray-xxx directly
        gray: {
          50:  '#f9fafb',
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
      },

      boxShadow: {
        purple: '0 10px 20px rgb(124 58 237 / 0.2)',
        'purple-lg': '0 20px 40px rgb(124 58 237 / 0.25)',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
