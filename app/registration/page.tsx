import { isRegistrationOpen } from "@/app/flags";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RegistrationAliasPage() {
  const active = await isRegistrationOpen();
  if (!active) {
    notFound();
  }
  redirect("/register");
}
