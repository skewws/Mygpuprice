/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGray: "rgb(179, 179, 179)",
        lightGray: "rgb(222, 222, 222)",
        bgGray: "rgb(247, 247, 247)",
      },
    },
  },
  plugins: [],
};
