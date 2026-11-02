import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Lexend } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import Intro from "./components/Intro";
import SoundToggle from "./components/SoundToggle";
import StructuredData from "./components/StructuredData";
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
  src: "./fonts/Dune_Rise.otf",
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://hack.ieeenirma.org");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HackIEEE 2026-27 | 48-Hour National Hackathon at Nirma University",
    template: "%s | HackIEEE 2026-27",
  },
  description:
    "HackIEEE 2026-27 is the premier national hackathon hosted by IEEE Computer Society at Nirma University in collaboration with Kiro. Build, stage, and ship considered code in 48 hours.",
  keywords: [
    "HackIEEE",
    "HackIEEE 2026",
    "HackIEEE 2027",
    "IEEE Computer Society",
    "Nirma University Hackathon",
    "Ahmedabad Hackathon",
    "National Hackathon India",
    "Kiro",
    "Coding Competition",
    "Web3",
    "AI",
    "Software Development",
  ],
  authors: [
    {
      name: "IEEE Computer Society Student Branch Chapter, Nirma University",
      url: "https://hack.ieeenirma.org",
    },
  ],
  creator: "IEEE Computer Society Student Branch Chapter, Nirma University",
  publisher: "IEEE Computer Society",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "HackIEEE 2026-27 | 48-Hour National Hackathon at Nirma University",
    description:
      "Join HackIEEE 2026-27 at Nirma University. 48 hours to innovate, build, and ship with top developers and industry mentors.",
    url: siteUrl,
    siteName: "HackIEEE 2026-27",
    images: [
      {
        url: "/OG-Tag.png",
        width: 1200,
        height: 630,
        alt: "HackIEEE 2026-27 — 48-Hour National Hackathon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackIEEE 2026-27 | 48-Hour National Hackathon",
    description:
      "Join HackIEEE 2026-27 at Nirma University. 48 hours to innovate, build, and ship with top developers.",
    images: ["/OG-Tag.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0906",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Context" />
        <StructuredData />
      </head>
      <body
        className={`${lexend.variable} ${duneRise.variable} ${plexMono.variable} antialiased font-sans`}
      >
        <Intro />
        <PageTransition />
        <Navbar />
        <SoundToggle />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
