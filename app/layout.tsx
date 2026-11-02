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
    default: "HackIEEE 2026-27 | National-Level 36-Hour Offline Hackathon at Nirma University",
    template: "%s | HackIEEE 2026-27",
  },
  description:
    "HackIEEE 2026-27 is a national 36-hour offline hackathon organised by IEEE Computer Society Nirma University. Register now to innovate, build, and ship.",
  keywords: [
    "HackIEEE",
    "HackIEEE 2026",
    "HackIEEE 2027",
    "National Level Hackathon",
    "National Hackathon India",
    "36-Hour Offline Hackathon",
    "All-India Hackathon",
    "IEEE Hackathon India",
    "Nirma University Hackathon",
    "Ahmedabad Hackathon",
    "Gujarat Tech Hackathon",
    "Student Hackathon 2027",
    "Kiro Hackathon",
    "Coding Marathon",
    "Hardware and Software Hackathon",
    "IEEE Computer Society",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Ahmedabad, Gujarat, India",
    "geo.position": "23.1287;72.5447",
    "ICBM": "23.1287, 72.5447",
    "event-type": "National-Level Hackathon",
    "event-duration": "36-Hour Offline Finale",
  },
  openGraph: {
    title: "HackIEEE 2026-27 | National-Level 36-Hour Offline Hackathon",
    description:
      "India's premier national 36-hour offline hackathon organised by IEEE Computer Society Nirma University. Build, stage, and ship considered products.",
    url: siteUrl,
    siteName: "HackIEEE 2026-27",
    images: [
      {
        url: "/OG-Tag.png",
        width: 1200,
        height: 630,
        alt: "HackIEEE 2026-27 — National-Level 36-Hour Offline Hackathon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackIEEE 2026-27 | National-Level 36-Hour Offline Hackathon",
    description:
      "India's premier national 36-hour offline hackathon organised by IEEE Computer Society Nirma University. Register now to innovate, build, and ship.",
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
