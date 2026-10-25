/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        strava: {
          orange: '#FC4C01',
          'orange-hover': '#FC5200',
          'orange-subtle': '#FFF0EB',
          dark: '#242428',
          black: '#0D0C0C',
          deep: '#21211F',
          muted: '#737373',
          'muted-dark': '#494950',
          border: '#DFDFE8',
          'border-light': '#E0E0DE',
          bg: '#F7F7FA',
          'bg-subtle': '#F0F0F5',
          'bg-card': '#FFFFFF',
          blue: '#007FB6',
          green: '#59A51D',
          'green-subtle': '#EBF7E3',
          warm: '#FCF8E3',
          'warm-border': '#FAEBCC',
          'warm-text': '#8A6D3B',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
