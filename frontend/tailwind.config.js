// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("@waitingonalice/design-system/tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    "./pages/**/*.{jsx,tsx}",
    "./src/**/*.{jsx,tsx}",
    "./node_modules/@waitingonalice/design-system/**/*.{cjs,js}",
  ],
};
