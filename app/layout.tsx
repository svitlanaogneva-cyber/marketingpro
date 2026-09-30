import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Unbounded } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import Lightbox from "@/components/Lightbox";
import Effects from "@/components/Effects";
import Analytics from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* Шрифти віддаються з нашого домену (self-hosted next/font) — без запитів до Google
   і без блимання тексту: size-adjust підбирає метрики системного fallback. */
const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-unbounded",
});
const nunito = Nunito_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = { themeColor: "#FDFCFC" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${unbounded.variable} ${nunito.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyCta />
        <Lightbox />
        <Effects />
        <Analytics />
      </body>
    </html>
  );
}
