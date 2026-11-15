import fs from "node:fs";
import { sendRegistrationConfirmationEmail } from "../services/email";

// Load .env.local
const envFile = fs.readFileSync(".env.local", "utf8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    process.env[match[1]] = match[2]?.trim();
  }
});

async function main() {
  console.log("Sending test confirmation email to Priyansh (priyanshpatel9506@gmail.com)...");
  const result = await sendRegistrationConfirmationEmail({
    name: "Priyansh Patel",
    email: "priyanshpatel9506@gmail.com",
    registrationId: "HI27-PP03-L4E0",
    college: "Nirma University, Ahmedabad",
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    yearOfStudy: "Third Year",
    isIeeeMember: true,
    ieeeMembershipNumber: "101524673",
  });
  console.log("Result:", JSON.stringify(result, null, 2));
}

main().catch(console.error);
