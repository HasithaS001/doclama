/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'slide-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        'slide-left': 'slide-left 30s linear infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            a: {
              color: '#0064bf',
              '&:hover': {
                color: '#0056a6',
              },
            },
            strong: {
              fontWeight: '600',
            },
            h1: {
              fontWeight: '600',
              fontSize: '1.75em',
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.5em',
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.25em',
            },
            code: {
              color: '#0064bf',
              backgroundColor: '#f3f4f6',
              padding: '0.2em 0.4em',
              borderRadius: '0.25em',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: '#f3f4f6',
              padding: '1em',
              borderRadius: '0.5em',
              overflow: 'auto',
            },
            ul: {
              paddingLeft: '1.5em',
            },
            ol: {
              paddingLeft: '1.5em',
            },
            li: {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
            p: {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
