const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: 'media',
  theme: {
    colors: {
      transparent: 'transparent',
      gray: colors.coolGray,
      yellow: colors.amber,
      red: colors.red,
      green: colors.emerald,
      blue: colors.sky,
      white: colors.white,
      black: colors.black
    },
    extend: {
      transitionProperty: {
        width: 'width'
      }
    },
  },
  variants: {
    extend: {
      fill: ['focus']
    },
  },
  plugins: [],
}
