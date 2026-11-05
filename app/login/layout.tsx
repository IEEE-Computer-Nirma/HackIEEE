import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | HackIEEE 2026-27",
  description: "Log in to your HackIEEE 2026-27 attendee portal.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
