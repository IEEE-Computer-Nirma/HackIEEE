import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | HackIEEE 2027",
  description: "Log in to your HackIEEE 2027 attendee portal.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
