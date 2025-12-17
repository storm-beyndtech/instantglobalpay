import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://instantglobal.com"),
  title: "InstantGlobal - Modern Payment Infrastructure",
  description:
    "Move money across borders instantly. Issue cards globally. Accept payments everywhere. Built for the next generation of businesses.",
  keywords: [
    "payments",
    "global accounts",
    "card issuing",
    "payouts",
    "FX",
    "fintech",
    "banking API",
  ],
  authors: [{ name: "InstantGlobal" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://instantglobal.com",
    siteName: "InstantGlobal",
    title: "InstantGlobal - Modern Payment Infrastructure",
    description:
      "Move money across borders instantly with modern APIs and infrastructure-grade reliability.",
    images: [
      {
        url: "/flyer-short.png",
        width: 1200,
        height: 630,
        alt: "InstantGlobal - Modern Payment Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantGlobal - Modern Payment Infrastructure",
    description:
      "Move money across borders instantly with modern APIs and infrastructure-grade reliability.",
    images: ["/flyer-short.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
