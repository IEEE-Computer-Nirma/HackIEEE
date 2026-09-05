import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSponsorshipEmail(data: {
  orgName: string;
  contactPerson: string;
  email: string;
  message?: string;
}) {
  try {
    await resend.emails.send({
      from: "HackIEEE Sponsorships <onboarding@resend.dev>",
      to: "deepensify@gmail.com",
      subject: `New Sponsorship Inquiry from ${data.orgName}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #16249E;">New Sponsorship Submission</h2>
          <p><strong>Organization:</strong> ${data.orgName}</p>
          <p><strong>Contact Person:</strong> ${data.contactPerson}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${data.message || "No message provided."}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send email notification:", error);
    // Throwing error allows the caller to handle it if needed
    throw error;
  }
}
