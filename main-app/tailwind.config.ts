import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        darkbg: "#242527",
        darkdarkbg: "#202122",
        lightbg: "#f5f5f5",
        lightblue: "#58a9db",
      },
      animation: {
        "slow-ping": "ping 8s cubic-bezier(0, 0, 0.2, 1) infinite",
        "medium-ping": "ping 4s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fast-ping": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        ping: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "20%": { opacity: "0.9" },
          "90": { transform: "scale(1.2)", opacity: "0.9" },
          "100%": { transform: "scale(1.2)", opacity: "0" }
        },
      },
    },
  },
} satisfies Config;
