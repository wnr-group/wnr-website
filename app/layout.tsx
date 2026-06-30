import type { Metadata } from "next";
import { Space_Grotesk, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wnrgroup.com"),
  title: {
    default: "WnR Group — Operational Intelligence for Modern Business",
    template: "%s | WnR Group",
  },
  description:
    "We build the operational brain of your business — custom platforms, AI-native workflows, and vertical SaaS products. We build, implement, train, and stay.",
  openGraph: {
    title: "WnR Group — Operational Intelligence for Modern Business",
    description:
      "We build the operational brain of your business — custom platforms, AI-native workflows, and vertical SaaS products. We build, implement, train, and stay.",
    siteName: "WnR Group",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${interTight.variable}`}
    >
      <body className="min-h-dvh flex flex-col bg-cream text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
