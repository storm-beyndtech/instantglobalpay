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
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantGlobal - Modern Payment Infrastructure",
    description:
      "Move money across borders instantly with modern APIs and infrastructure-grade reliability.",
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
