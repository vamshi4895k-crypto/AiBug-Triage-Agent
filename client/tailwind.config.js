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
        term: {
          bg: '#080a0d',
          surface: '#0d1117',
          card: '#12171f',
          cardHover: '#171e28',
          border: '#1e2633',
          borderHighlight: '#2d3748',
          textMuted: '#6b7a90',
          textNormal: '#cbd5e1',
          textBright: '#f8fafc',
          accent: '#00f0ff',
          accentGlow: 'rgba(0, 240, 255, 0.15)',
          emerald: '#10b981',
          emeraldGlow: 'rgba(16, 185, 129, 0.15)',
          amber: '#f59e0b',
          amberGlow: 'rgba(245, 158, 11, 0.15)',
          rose: '#ff3366',
          roseGlow: 'rgba(255, 51, 102, 0.15)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Geist"', '"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'laser': 'laser 2s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        laser: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleX(0.95)' },
          '50%': { opacity: '1', transform: 'scaleX(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
