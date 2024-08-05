import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)"],
        "dm-mono": ["var(--font-dm-mono)"],
      },
      colors: {
        green: {
          light: "var(--green-light)",
          primary: "var(--green-primary)",
          secondary: "var(--green-secondary)",
        },
        white: {
          primary: "var(--white-primary)",
          secondary: "var(--white-secondary)",
          secondary2: "var(--white-secondary2)",
          secondary3: "var(--white-secondary3)",
          secondary4: "var(--white-secondary4)",
        },
        black: {
          primary: "var(--black-primary)",
          secondary: "var(--black-secondary)",
          secondary2: "var(--black-secondary2)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderWidth: {
        DEFAULT: "1px",
        "0": "0",
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "6": "6px",
        "8": "8px",
      },
      fontSize: {
        xs: "16px",
        sm: "20px",
        md: "24px",
        xl: "30px",
        "2xl": "56px",
        "3xl": "88px",
      },
      gridTemplateColumns: {
        main: "repeat(12, 0.5fr)",
        navLinks: "repeat(4, 1fr)",
      },
      gridTemplateRows: {
        "header-xs": "repeat(7, 70px)",
        header: "repeat(9, 86px)",
      },
      boxShadow: {
        "reactgrid-sample": "0px 4px 64px 0px rgba(0, 0, 0, 0.12)",
      },
    },
    screens: {
      sm: "640px",
      md: "780px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          success: "#107c41",
        },
      },
    ],
  },

  plugins: [require("daisyui")],
};

export default config;
