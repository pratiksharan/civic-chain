/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          bg:             '#f6f7f5',
          surf:           '#ffffff',
          'surf-alt':     '#f0f2ef',
          bord:           '#dde1da',
          'bord-light':   '#eaece8',
          txt:            '#1c2b1e',
          'txt-mid':      '#3a4d3d',
          muted:          '#7a8c7e',
          dim:            '#a0b0a4',
          blue:           '#2c5f8a',
          'blue-light':   '#eaf1f8',
          teal:           '#2e7d62',
          'teal-light':   '#ebf5f0',
          'teal-bord':    '#b0d9c8',
          red:            '#c0392b',
          'red-light':    '#fdf1f0',
          amb:            '#b45309',
          'amb-light':    '#fef9ee',
          grn:            '#1a6e3f',
          'grn-light':    '#eefaf2',
          dot:            '#4caf7d',
          'side-base':    '#0f1923',
          'side-surf':    '#162130',
          'side-bord':    '#1e2e3f',
          'side-txt':     '#c8d8e8',
          'side-muted':   '#7a96ab',
          'side-dim':     '#4a6070',
          'side-active':  '#1a3a50',
          'side-active-bord': '#2e9d82',
          'side-hover':   '#162d40',
          'side-dot':     '#2e9d82',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ["'Courier New'", 'Courier', 'monospace'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'spin-fast': 'spin 0.7s linear infinite',
        'fade-in': 'fadeIn 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
