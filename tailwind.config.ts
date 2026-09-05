import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        float: '0 12px 35px rgba(0,0,0,.14)',
      },
    },
  },
  plugins: [],
} satisfies Config
