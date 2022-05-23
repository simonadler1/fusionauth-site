/*
 * Copyright (c) 2022, Inversoft Inc., All Rights Reserved
 */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './site/**/*.{adoc,html,js,liquid,md}'
  ],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      background: '#f6f5f5',
      old: '#eeeeee',
      faGray: {
        light: '#e6e7e8',
        dark: '#3e4e50'
      },
      gray: colors.slate,
      green: colors.teal,
      indigo: colors.indigo,
      blue: colors.blue,
      sky: colors.sky,
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f58320',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
      red: colors.rose,
      white: colors.white
    },
    extend: {
      borderWidth: {
        '10': '10px'
      },
      boxShadow: {
        'aside': '0 2px 4px 0 rgba(0,0,13,0.14), 0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)',
        'dropdown': '0 9px 12px 1px rgba(0,0,0,0.14), 0 3px 16px 2px rgba(0,0,0,0.12), 0 5px 6px -3px rgba(0,0,0,0.20)',
        // 'dropdown': '0px 1px 1px 0px rgba(0, 28, 36, 0.3), 1px 1px 1px 0px rgba(0, 28, 36, 0.15), -1px 1px 1px 0px rgba(0, 28, 36, 0.15)',
        'panel': '0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20)'
      },
      fontFamily: {
        'awesome': '"Font Awesome 6 Pro"'
      },
      maxWidth: {
        '8xl': '90rem'
      },
      transformOrigin: {
        '0': '0%'
      }
    },
    fontFamily: {
      sans: ['"Inter var"', '-apple-system', 'system-ui', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif']
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
  variants: {
    borderColor: ['focus', 'focus-within', 'hover', 'responsive']
  }
}
