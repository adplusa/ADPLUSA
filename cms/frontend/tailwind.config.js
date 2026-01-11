/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black and white theme
        border: "rgb(229 231 235)", // gray-200
        input: "rgb(229 231 235)", // gray-200
        ring: "rgb(0 0 0)", // black
        background: "rgb(255 255 255)", // white
        foreground: "rgb(0 0 0)", // black
        primary: {
          DEFAULT: "rgb(0 0 0)", // black
          foreground: "rgb(255 255 255)", // white
        },
        secondary: {
          DEFAULT: "rgb(245 245 245)", // gray-100
          foreground: "rgb(0 0 0)", // black
        },
        destructive: {
          DEFAULT: "rgb(220 38 38)", // red-600
          foreground: "rgb(255 255 255)", // white
        },
        muted: {
          DEFAULT: "rgb(245 245 245)", // gray-100
          foreground: "rgb(107 114 128)", // gray-500
        },
        accent: {
          DEFAULT: "rgb(245 245 245)", // gray-100
          foreground: "rgb(0 0 0)", // black
        },
        popover: {
          DEFAULT: "rgb(255 255 255)", // white
          foreground: "rgb(0 0 0)", // black
        },
        card: {
          DEFAULT: "rgb(255 255 255)", // white
          foreground: "rgb(0 0 0)", // black
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
