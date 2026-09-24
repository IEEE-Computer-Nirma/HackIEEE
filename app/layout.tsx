import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Lexend } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Dune Rise (Fontswan, SIL OFL 1.1 — see app/fonts/Dune_Rise-License.txt).
// Shipped unmodified; metrics pinned so every browser puts the baseline in the same place.
const duneRise = localFont({
  src: "./fonts/Dune_Rise.ttf",
  variable: "--font-dune",
  display: "swap",
  declarations: [
    { prop: "ascent-override", value: "80%" },
    { prop: "descent-override", value: "20%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "HackIEEE 2026 | Where Innovation Meets Impact",
  description:
    "Join HackIEEE 2026, the ultimate hackathon experience. Build, innovate, and compete with top developers from around the world. 48 hours. Limitless possibilities.",
  keywords: ["hackathon", "IEEE", "HackIEEE", "coding", "innovation", "2026"],
  openGraph: {
    title: "HackIEEE 2026 | Where Innovation Meets Impact",
    description: "Join HackIEEE 2026, the ultimate hackathon experience. 48 hours. Limitless possibilities.",
    siteName: "HackIEEE 2026",
    images: [
      {
        url: "/OG-Tag.png",
        width: 1200,
        height: 630,
        alt: "HackIEEE 2026 - Where Innovation Meets Impact",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackIEEE 2026 | Where Innovation Meets Impact",
    description: "Join HackIEEE 2026, the ultimate hackathon experience. 48 hours. Limitless possibilities.",
    images: ["/OG-Tag.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0906",
  viewportFit: "cover",
};

// Runs before paint so a saved day theme never flashes night first.
const themeScript = `try{if(localStorage.getItem("hackieee-theme")==="day")document.documentElement.dataset.theme="day"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${lexend.variable} ${duneRise.variable} ${plexMono.variable} antialiased font-sans`}
      >
        <PageTransition />
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
