/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fff8f0",
          100: "#ffefd6",
          200: "#ffdba8",
          300: "#ffc170",
          400: "#ffa03d",
          500: "#e8822a",
          600: "#cc6a1a",
          700: "#a85216",
          800: "#874118",
          900: "#6e3716",
        },
        terracotta: {
          50: "#fdf5f0",
          100: "#fae8dc",
          200: "#f5ceb8",
          300: "#eeae8c",
          400: "#e28659",
          500: "#be5a28",
          600: "#a34820",
          700: "#86391c",
          800: "#6d2f1b",
          900: "#5a2819",
        },
        turmeric: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#d9a80a",
          600: "#b38506",
          700: "#8a6509",
          800: "#6f5010",
          900: "#5c4213",
        },
        clay: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#ede4d4",
          300: "#e0d2b8",
          400: "#cfba96",
          500: "#b89b6e",
          600: "#a58456",
          700: "#8a6c47",
          800: "#72593e",
          900: "#5e4a36",
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ['"Lato"', "sans-serif"],
      },
      borderRadius: {
        classical: "0.25rem",
      },
      backgroundImage: {
        "cross-hatch":
          "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23e8d5b8' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
