import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | HackIEEE 2026-27",
  description: "Register for HackIEEE 2026-27, the flagship 48-hour student hackathon at Nirma University.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
