import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLoginOpen, isRegistrationOpen } from "@/app/flags";
import { AuthNavProvider } from "@/app/components/AuthProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login | HackIEEE 2027",
  description: "Log in to your HackIEEE 2027 attendee portal.",
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loginOpen, registrationOpen] = await Promise.all([
    isLoginOpen(),
    isRegistrationOpen(),
  ]);

  if (!loginOpen) {
    notFound();
  }

  return (
    <AuthNavProvider registrationOpen={registrationOpen} loginOpen={loginOpen}>
      {children}
    </AuthNavProvider>
  );
}
