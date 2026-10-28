/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff41',
        'cyber-black': '#050505',
        'fud-red': '#ff003c',
        'ai-cyan': '#00f3ff'
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}