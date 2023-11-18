import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        darkbg: "#242527",
        lightbg: "#f5f5f5"
      }
    },
  },
  plugins: [],
} satisfies Config;
