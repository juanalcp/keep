const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        note: {
          red: 'hsl(var(--note-red))',
          'red-dark': 'hsl(var(--note-red-dark))',
          orange: 'hsl(var(--note-orange))',
          'orange-dark': 'hsl(var(--note-orange-dark))',
          yellow: 'hsl(var(--note-yellow))',
          'yellow-dark': 'hsl(var(--note-yellow-dark))',
          green: 'hsl(var(--note-green))',
          'green-dark': 'hsl(var(--note-green-dark))',
          blue: 'hsl(var(--note-blue))',
          'blue-dark': 'hsl(var(--note-blue-dark))',
          purple: 'hsl(var(--note-purple))',
          'purple-dark': 'hsl(var(--note-purple-dark))',
          pink: 'hsl(var(--note-pink))',
          'pink-dark': 'hsl(var(--note-pink-dark))',
          brown: 'hsl(var(--note-brown))',
          'brown-dark': 'hsl(var(--note-brown-dark))',
          gray: 'hsl(var(--note-gray))',
          'gray-dark': 'hsl(var(--note-gray-dark))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
