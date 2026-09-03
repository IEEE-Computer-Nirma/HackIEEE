import type { Metadata } from "next";
import { Lexend, Orbitron, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

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
  title: "HackIEEE 2026 — Where Innovation Meets Impact",
  description:
    "Join HackIEEE 2026, the ultimate hackathon experience. Build, innovate, and compete with top developers from around the world. 48 hours. Limitless possibilities.",
  keywords: ["hackathon", "IEEE", "HackIEEE", "coding", "innovation", "2026"],
  openGraph: {
    title: "HackIEEE 2026",
    description: "Where Innovation Meets Impact — 48 Hours of Limitless Possibility",
    type: "website",
  },
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <head>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Orbitron:wght@400..900&family=Sora:wght@100..800&display=swap');`}
        </style>
      </head>
      <body
        className={`${lexend.variable} ${orbitron.variable} ${sora.variable} antialiased`}
        style={{ fontFamily: "'Lexend', sans-serif" }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
