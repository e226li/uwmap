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
        lightbg: "#f5f5f5",
        lightblue: "#58a9db",
      },
      animation: {
        "slow-ping": "ping 8s cubic-bezier(0, 0, 0.2, 1) infinite",
        "medium-ping": "ping 5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fast-ping": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
      }
    },
  },
} satisfies Config;
