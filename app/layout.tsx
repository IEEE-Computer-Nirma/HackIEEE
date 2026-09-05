import type { Metadata } from "next";
import { Lexend, Orbitron, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
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
        url: "/OG-Tag.png", // Next.js will automatically look for this in the public folder
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

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Orbitron:wght@400..900&family=Sora:wght@100..800&display=swap');`}
        </style>
      </head>
      <body
        className={`${lexend.variable} ${orbitron.variable} ${sora.variable} antialiased font-sans`}
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
