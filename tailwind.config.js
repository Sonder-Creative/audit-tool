/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Semantic tokens driven by CSS variables (see index.css).
        // These swap automatically when `.dark` is on <html>.
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-fill': 'rgb(var(--c-accent-fill) / <alpha-value>)',
        divider: 'rgb(var(--c-divider) / <alpha-value>)',
        body: 'rgb(var(--c-body) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        // Sidebar = brand navy in BOTH modes (fixed, not theme-driven).
        sidebar: {
          DEFAULT: '#0F1A2E',
          elevated: '#1A2740',
          active: '#1E306B',
          fg: '#E4ECF8',
          muted: '#8A9AB4',
          border: '#243650',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 26 46 / 0.05), 0 4px 14px rgb(15 26 46 / 0.07)',
        'card-hover': '0 2px 6px rgb(15 26 46 / 0.08), 0 12px 30px rgb(15 26 46 / 0.12)',
        badge: '0 2px 8px rgb(53 91 255 / 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
