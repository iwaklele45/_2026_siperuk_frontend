import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0ff',
          100: '#d2e0ff',
          200: '#a7c2ff',
          300: '#7ba3ff',
          400: '#4f85ff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#193fa6',
          800: '#133175',
          900: '#0c2344',
        },
        slate: {
          950: '#0b1224',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 60px -30px rgba(37, 99, 235, 0.35)',
        soft: '0 10px 30px -20px rgba(15, 23, 42, 0.35)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
}

export default config
