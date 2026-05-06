import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Mirror mapa-del-olvido accent palette so the whole site reads as one product.
        primary: {
          DEFAULT: "#FB923C", // orange-400
          hover: "#F97316", // orange-500
        },
        accent: {
          cyan: "#7DD3FC",
          rose: "#FB7185",
        },
        paralizada: "#EF4444",
        critica: "#F97316",
        inoperativa: "#94A3B8",
      },
    },
  },
  plugins: [],
};

export default config;
