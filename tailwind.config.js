
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0 0% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
        card: 'hsl(0 0% 3.9%)',
        'card-foreground': 'hsl(0 0% 98%)',
        popover: 'hsl(0 0% 3.9%)',
        'popover-foreground': 'hsl(0 0% 98%)',
        primary: 'hsl(221.2 83.2% 53.3%)',
        'primary-foreground': 'hsl(210 40% 98%)',
        secondary: 'hsl(217.2 32.6% 17.5%)',
        'secondary-foreground': 'hsl(210 40% 98%)',
        muted: 'hsl(217.2 32.6% 17.5%)',
        'muted-foreground': 'hsl(215 20.2% 65.1%)',
        accent: 'hsl(217.2 32.6% 17.5%)',
        'accent-foreground': 'hsl(210 40% 98%)',
        destructive: 'hsl(0 62.8% 30.6%)',
        'destructive-foreground': 'hsl(0 0% 98%)',
        border: 'hsl(217.2 32.6% 17.5%)',
        input: 'hsl(217.2 32.6% 17.5%)',
        ring: 'hsl(222.2 83.2% 53.3%)',
      },
    },
  },
  plugins: [require('tw-animate-css')],
}
