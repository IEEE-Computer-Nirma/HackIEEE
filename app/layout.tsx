import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Lexend, Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import { authNavMode, getFallbackAuthNavMode, type AuthNavMode } from "./flags";
import PageTransition from "./components/PageTransition";
import Intro from "./components/Intro";
import SoundToggle from "./components/SoundToggle";
import StructuredData from "./components/StructuredData";
import UniversitiesPrefetcher from "./components/UniversitiesPrefetcher";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    default: "HackIEEE 2026-27 | National-Level 48-Hour Offline Hackathon at Nirma University",
    template: "%s | HackIEEE 2026-27",
  },
  description:
    "HackIEEE 2026-27 is a national 48-hour offline hackathon organised by IEEE Computer Society Nirma University. Register now to innovate, build, and ship.",
  keywords: [
    "HackIEEE",
    "HackIEEE 2026",
    "HackIEEE 2027",
    "National Level Hackathon",
    "National Hackathon India",
    "48-Hour Offline Hackathon",
    "48-Hour Hackathon",
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
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
    "event-duration": "48-Hour Offline Finale",
  },
  openGraph: {
    title: "HackIEEE 2026-27 | National-Level 48-Hour Offline Hackathon",
    description:
      "India's premier national 48-hour offline hackathon organised by IEEE Computer Society Nirma University. Build, stage, and ship considered products.",
    url: siteUrl,
    siteName: "HackIEEE 2026-27",
    images: [
      {
        url: "/OG-Tag.png",
        width: 1200,
        height: 630,
        alt: "HackIEEE 2026-27 — National-Level 48-Hour Offline Hackathon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackIEEE 2026-27 | National-Level 48-Hour Offline Hackathon",
    description:
      "India's premier national 48-hour offline hackathon organised by IEEE Computer Society Nirma University. Register now to innovate, build, and ship.",
    images: ["/OG-Tag.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0906",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let navMode: AuthNavMode = getFallbackAuthNavMode();
  try {
    navMode = await authNavMode();
  } catch {
    navMode = getFallbackAuthNavMode();
  }

  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Context" />
        <StructuredData />
      </head>
      <body
        suppressHydrationWarning
        className={`${lexend.variable} ${duneRise.variable} ${plexMono.variable} antialiased font-sans`}
      >
        <Intro />
        <UniversitiesPrefetcher />
        <PageTransition />
        <Navbar authNavMode={navMode} />
        <SoundToggle />
        {children}
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
