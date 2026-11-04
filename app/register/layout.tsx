import { redirect } from "next/navigation";
import { isRegistrationActive } from "@/app/flags";

export const dynamic = "force-dynamic";

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let active = false;
  try {
    active = Boolean(await isRegistrationActive());
  } catch {
    active = false;
  }

  if (!active) {
    redirect("/");
  }

  return <>{children}</>;
}
