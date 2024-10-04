import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderWidth: {
        "0": "0",
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "6": "6px",
        "8": "8px",
        DEFAULT: "1px",
      },
      fontSize: {
        "2xs": "12px",
        xs: "16px",
        sm: "20px",
        md: "24px",
        xl: "30px",
        "2xl": "56px",
        "3xl": "88px",
      },
      gridTemplateColumns: {
        main: "repeat(12, 0.5fr)",
        navLinks: "repeat(3, 1fr)",
      },
      gridTemplateRows: {
        "header-xs": "repeat(6, 70px)",
        header: "repeat(9, 86px)",
      },
      boxShadow: {
        "reactgrid-sample": "0px 4px 64px 0px rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
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

  plugins: [require("daisyui"), require("tailwindcss-animate")],
};

export default config;
