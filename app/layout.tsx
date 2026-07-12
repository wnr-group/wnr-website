import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/ui/motion";

/* A/B hero picker. Runs before paint so there is no flash and no hydration
   mismatch: it only sets an attribute on <html>, which CSS reads to reveal the
   right variant. First-ever visit → A (the current design); every reload after
   that strictly alternates A→B→A. JS-disabled falls back to A (the default). */
const heroABScript = `(function(){try{var k="wnr-hero-variant";var last=localStorage.getItem(k);var next=last==="A"?"B":"A";localStorage.setItem(k,next);document.documentElement.setAttribute("data-hero",next);}catch(e){document.documentElement.setAttribute("data-hero","A");}})();`;

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
      data-scroll-behavior="smooth"
      data-hero="A"
      className={`${spaceGrotesk.variable} ${interTight.variable}`}
    >
      <body className="min-h-dvh flex flex-col bg-canvas text-body antialiased">
        <Script id="wnr-hero-ab" strategy="beforeInteractive">
          {heroABScript}
        </Script>
        <MotionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
