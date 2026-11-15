import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isRegistrationOpen, isLoginOpen } from "@/app/flags";
import { AuthNavProvider } from "@/app/components/AuthProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register | HackIEEE 2027",
  description: "Complete your HackIEEE 2027 registration.",
};

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [registrationOpen, loginOpen] = await Promise.all([
    isRegistrationOpen(),
    isLoginOpen(),
  ]);

  if (!registrationOpen) {
    notFound();
  }

  return (
    <AuthNavProvider registrationOpen={registrationOpen} loginOpen={loginOpen}>
      {children}
    </AuthNavProvider>
  );
}
