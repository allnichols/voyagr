const { default: daisyui } = require("daisyui");
const { default: themes } = require("daisyui/theme/object");

module.exports = {
    content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    container: {
        center: true,
        padding: {
            DEFAULT: "1rem",
            sm: "1.5rem",
            lg: "2.5rem"
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1400px"
        }
    },
    extend: {}
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: ["corporate"]
  }
}