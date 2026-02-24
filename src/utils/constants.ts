export const SITE_COLORS = {
  primary: "#000000",
  secondary: "#ffffff",
  tertiary: "#f0f0f0",
  quaternary: "#e0e0e0",
  quinary: "#d0d0d0",
} as const;

export const APP_NON_NGROK_DOMAIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_APP_URL;

export const APP_ROOT_DOMAIN =
  process.env.NODE_ENV === "development"
    ? process.env.NGROK_URL
    : process.env.NEXT_PUBLIC_APP_URL;
