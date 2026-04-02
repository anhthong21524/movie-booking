import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        primary: {
          50: '#f2f7ff',
          100: '#dce9ff',
          200: '#b8d3ff',
          300: '#84b2ff',
          400: '#4e8cff',
          500: '#2563eb',
          600: '#1748c7',
          700: '#163aa1',
          800: '#19327f',
          900: '#1b2d68',
        },
        accent: {
          500: '#f59e0b',
          600: '#d97706',
        },
        success: '#16a34a',
        danger: '#dc2626',
        muted: '#64748b',
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Space Grotesk"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
