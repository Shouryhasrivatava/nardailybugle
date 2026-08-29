/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spidey: {
          red: '#E23636',
          darkRed: '#BA1C1C',
          blue: '#0B4F6C',
          darkBlue: '#062F40',
          yellow: '#FDB813',
          darkYellow: '#E5A50B',
          black: '#111111',
          paper: '#FFFBF0',
          paperDark: '#F4ECD8',
          gray: '#E6E6E6',
        }
      },
      fontFamily: {
        headline: ['Bangers', 'Impact', 'sans-serif'],
        comic: ['"Comic Neue"', 'cursive', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'comic-sm': '3px 3px 0px #111111',
        'comic': '5px 5px 0px #111111',
        'comic-lg': '8px 8px 0px #111111',
        'comic-xl': '12px 12px 0px #111111',
        'comic-red': '5px 5px 0px #E23636',
        'comic-yellow': '5px 5px 0px #FDB813',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      }
    },
  },
  plugins: [],
}
