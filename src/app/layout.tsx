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
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const BODY_CLASS_NAME = `bg-background text-foreground relative overflow-x-hidden overscroll-none antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200`;

export const metadata: Metadata = {
  metadataBase: new URL("https://foundersonx.com"),
  title: "Founders on X | Real engagement. Real growth.",
  description:
    "A tight circle of tech founders helping each other grow on X. Real engagement, real connections.",
  openGraph: {
    title: "Founders on X | Real engagement. Real growth.",
    description:
      "A tight circle of tech founders helping each other grow on X. Real engagement, real connections.",
    url: "https://foundersonx.com",
    siteName: "Founders on X",
    images: [
      {
        url: "/founders-on-x-og-image.png",
        width: 1200,
        height: 630,
        alt: "Founders on X Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Founders on X | Real engagement. Real growth.",
    description:
      "A tight circle of tech founders helping each other grow on X. Real engagement, real connections.",
    images: ["/founders-on-x-og-image.png"],
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
            defaultTheme="dark"
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
