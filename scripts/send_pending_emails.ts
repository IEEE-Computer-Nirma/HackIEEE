import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { sendRegistrationConfirmationEmail } from "../services/email";

// Load environment variables from .env.local
const envFile = fs.readFileSync(".env.local", "utf8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    process.env[match[1]] = match[2]?.trim();
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = !args.includes("--send");
  const fromId = parseInt(args.find((a) => a.startsWith("--from="))?.split("=")[1] || "14", 10);
  const toId = parseInt(args.find((a) => a.startsWith("--to="))?.split("=")[1] || "25", 10);

  console.log("==========================================================");
  console.log("       HackIEEE 2027 — Automated Pending Email Dispatcher");
  console.log("==========================================================");
  console.log(`Mode:      ${isDryRun ? "DRY RUN (Preview only, pass --send to dispatch)" : "LIVE SEND"}`);
  console.log(`ID Range:  ${fromId} to ${toId}`);
  console.log("==========================================================\n");

  const { data: records, error } = await supabase
    .from("registrations")
    .select("*")
    .gte("id", fromId)
    .lte("id", toId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Database query failed:", error);
    process.exit(1);
  }

  if (!records || records.length === 0) {
    console.log(`No registrations found in range ${fromId}..${toId}.`);
    return;
  }

  console.log(`Found ${records.length} registrations to process:\n`);

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    console.log(
      `[${i + 1}/${records.length}] DB ID: ${r.id} | Reg ID: ${r.registration_id} | Name: ${r.full_name} | Email: ${r.email}`
    );
  }

  if (isDryRun) {
    console.log("\n[DRY RUN COMPLETE] Zero emails were sent.");
    console.log("To dispatch emails to these recipients, run:");
    console.log(`  npx tsx scripts/send_pending_emails.ts --from=${fromId} --to=${toId} --send\n`);
    return;
  }

  console.log("\nStarting live email dispatch...\n");
  const summary: { id: number; email: string; success: boolean; resendId?: string; error?: string }[] = [];

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    console.log(`\n[${i + 1}/${records.length}] Dispatching to ${r.email} (${r.full_name})...`);

    const result = await sendRegistrationConfirmationEmail({
      name: r.full_name,
      email: r.email,
      registrationId: r.registration_id,
      college: r.university || r.data?.university || "Nirma University",
      degree: r.degree || r.data?.degree,
      branch: r.branch || r.data?.branch,
      yearOfStudy: r.year_of_study || r.data?.yearOfStudy,
      isIeeeMember: r.is_ieee_member || r.data?.isIeeeMember,
      ieeeMembershipNumber: r.ieee_membership_number || r.data?.ieeeMembershipNumber,
    });

    if (result.success) {
      console.log(`  ✓ DELIVERED | Resend ID: ${result.id}`);
      summary.push({ id: r.id, email: r.email, success: true, resendId: result.id });
    } else {
      console.error(`  ✗ FAILED | Error: ${result.error}`);
      summary.push({ id: r.id, email: r.email, success: false, error: result.error });
    }

    // Rate-limiting delay to avoid hitting provider burst limits
    if (i < records.length - 1) {
      await sleep(650);
    }
  }

  console.log("\n==========================================================");
  console.log("                  DISPATCH SUMMARY");
  console.log("==========================================================");
  const successCount = summary.filter((s) => s.success).length;
  const failureCount = summary.length - successCount;
  console.log(`Total:     ${summary.length}`);
  console.log(`Success:   ${successCount}`);
  console.log(`Failed:    ${failureCount}`);
  console.log("==========================================================");
}

main().catch(console.error);
