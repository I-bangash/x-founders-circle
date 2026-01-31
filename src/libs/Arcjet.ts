import arcjet, { shield } from "@arcjet/next";

export default arcjet({
  // Direct process.env access to reduce middleware bundle size
  key: process.env.ARCJET_KEY ?? "",
  characteristics: ["ip.src"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});
