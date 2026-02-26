import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsla(var(--border))",
        input: "hsla(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        mac: {
          window: "hsl(var(--mac-window-bg))",
          titlebar: "hsl(var(--mac-titlebar))",
          sidebar: "hsl(var(--mac-sidebar))",
          red: "hsl(var(--mac-traffic-red))",
          yellow: "hsl(var(--mac-traffic-yellow))",
          green: "hsl(var(--mac-traffic-green))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsla(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        mac: "12px",
        dock: "16px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "window-open": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "window-close": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.5)", opacity: "0" },
        },
        "dock-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-30px)" },
          "50%": { transform: "translateY(-15px)" },
          "75%": { transform: "translateY(-22px)" },
        },
        "boot-progress": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "notification-in": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "notification-out": {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(100%)" },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "minimize": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.2) translateY(100vh)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "window-open": "window-open 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "window-close": "window-close 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "dock-bounce": "dock-bounce 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "boot-progress": "boot-progress 2.5s ease-in-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-down": "slide-down 0.2s ease-out",
        "notification-in": "notification-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "notification-out": "notification-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "cursor-blink": "cursor-blink 1s step-end infinite",
        "minimize": "minimize 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
