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
        background: {
          DEFAULT: '#090D16',
          secondary: '#0F172A',
          card: '#131D31',
          surface: '#1A2640',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        brand: {
          cyan: '#06B6D4',
          blue: '#3B82F6',
          indigo: '#6366F1',
          purple: '#8B5CF6',
          violet: '#A855F7',
          pink: '#EC4899',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
        'ripple': 'ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.25), 0 0 30px rgba(99, 102, 241, 0.15)' },
          '100%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(99, 102, 241, 0.3)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.0)' }
        }
      }
    },
  },
  plugins: [],
}
