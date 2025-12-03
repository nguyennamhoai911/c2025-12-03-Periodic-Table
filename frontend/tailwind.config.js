/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 
  ],
  theme: {
    extend: {
      
      colors: {
        dopamine: "#FFDE76", // Yellow
        oxytocin: "#FF8688", // Red
        serotonin: "#5ECF98", // Green
        endorphin: "#C497F7", // Purple
      },
    },
  },
  plugins: [],
};
