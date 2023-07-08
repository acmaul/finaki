export const corsConfig = {
  origin: [
    "https://finaki.vercel.app", // vercel domain
    "http://localhost:3000", // development
  ],
  credentials: true,
  sameSite: "none" as const,
};
