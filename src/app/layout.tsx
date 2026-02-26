import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";

import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import ConvexClientProvider from "@/providers/convex-provider";
import { PostHogProvider } from "@/providers/posthog-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

const BODY_CLASS_NAME = `bg-background text-foreground relative overflow-x-hidden overscroll-none pb-10 antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200`;

export const metadata: Metadata = {
  title: "OutliersX | Engagement Intelligence Board",
  description: "A precision interface for tracking social engagement behavior.",

  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable} ${geistSans.variable} ${geistMono.variable} ${BODY_CLASS_NAME}`}
      >
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider>
              <ConvexClientProvider>
                {children}
                <GoogleAnalytics gaId="" />
                <Toaster />
              </ConvexClientProvider>
            </ClerkProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
