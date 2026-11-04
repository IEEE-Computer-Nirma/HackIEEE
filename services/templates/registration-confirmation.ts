import { getDuneRiseWordmarkSvg } from "./dune-wordmark";

/**
 * Registration Confirmation Email Template
 * Strictly adheres to the HackIEEE Dune website aesthetic:
 * - Obsidian dark background (#0b0906 / #140e0a)
 * - Restrained warm sand gold (#f8cf96) and spice (#e2822f)
 * - Authentic Dune Rise letterforms with large hack-italic display heading
 * - Minimalist, high-legibility key-value record table (no bloat)
 * - Single solid 'Add to Google Calendar' CTA button
 * - Clean thank-you letter and 'Stay tuned' briefing
 */

export interface RegistrationEmailData {
  name: string;
  email: string;
  registrationId: string;
  college: string;
  degree?: string;
  branch?: string;
  yearOfStudy?: string;
  isIeeeMember?: boolean;
  ieeeMembershipNumber?: string;
  track?: string;
}

export function renderRegistrationEmail({
  name,
  email,
  registrationId,
  college,
  degree,
  branch,
  yearOfStudy,
  isIeeeMember,
  ieeeMembershipNumber,
  track,
}: RegistrationEmailData) {
  const subject = `Registration Confirmed: hackieee 2026-27 [${registrationId}]`;

  // Google Calendar Template URL
  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent("HackIEEE 2027 | National 48-Hour Offline Hackathon") +
    "&dates=20270102T043000Z/20270105T123000Z" +
    "&details=" +
    encodeURIComponent(
      `HackIEEE 2026-27 National 48-Hour Offline Hackathon.\nRegistration ID: ${registrationId}\nParticipant: ${name}\nVenue: Nirma University, Ahmedabad.\n\nOrganised by IEEE Computer Society at Nirma University.`
    ) +
    "&location=" +
    encodeURIComponent("Nirma University, Sarkhej-Gandhinagar Highway, Gota, Ahmedabad, Gujarat 382481, India");

  // Format basic academic info
  const degreeBranch = [degree, branch].filter(Boolean).join(" — ");
  const membershipText = isIeeeMember
    ? ieeeMembershipNumber
      ? `Active Member (#${ieeeMembershipNumber})`
      : "Active IEEE Member"
    : "Non-Member";

  // Build basic information rows cleanly
  const basicInfo: { label: string; value: string }[] = [
    { label: "Participant Name", value: name },
    { label: "Registered Email", value: email },
    { label: "Institution / College", value: college },
  ];

  if (degreeBranch) {
    basicInfo.push({ label: "Degree & Branch", value: degreeBranch });
  }

  if (yearOfStudy) {
    basicInfo.push({ label: "Year of Study", value: yearOfStudy });
  }

  basicInfo.push({ label: "IEEE Membership", value: membershipText });

  if (track && track !== "Open Innovation") {
    basicInfo.push({ label: "Preferred Track", value: track });
  }

  const wordmarkSvg = getDuneRiseWordmarkSvg(280);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0906; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3e6cf; -webkit-font-smoothing: antialiased;">
  <!-- Background Shell -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0906; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 44px 16px 56px;">
        <!-- Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #140e0a; border: 1px solid rgba(248, 207, 150, 0.16); border-radius: 20px; overflow: hidden; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);">
          
          <!-- Subtle Sand Hairline Accent (No Loud Gradients) -->
          <tr>
            <td style="height: 3px; background-color: #e2822f;"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding: 38px 36px 20px; text-align: center;">
              <!-- Eyebrow / Kicker -->
              <p style="margin: 0 0 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: #e2822f;">
                IEEE Computer Society &bull; Nirma University
              </p>

              <!-- Dune Rise Vector Wordmark -->
              <div style="margin: 0 auto 10px; text-align: center;">
                ${wordmarkSvg}
              </div>

              <!-- Large Hack-Italic Dune Heading Fallback / Display -->
              <h1 style="margin: 0; font-family: 'Dune Rise', 'Cinzel', -apple-system, BlinkMacSystemFont, 'Segoe UI', serif; font-size: 28px; font-weight: 700; font-style: italic; letter-spacing: 0.18em; text-transform: lowercase; color: #f8cf96; line-height: 1.2;">
                hackieee <span style="font-size: 20px; font-style: normal; color: rgba(243, 230, 207, 0.7); letter-spacing: 0.08em;">2026–27</span>
              </h1>
              
              <p style="margin: 8px 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; font-style: italic; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(243, 230, 207, 0.65);">
                National 48-Hour Offline Hackathon &bull; Nirma University
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge Card -->
          <tr>
            <td style="padding: 6px 36px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0e0906; border: 1px solid rgba(248, 207, 150, 0.2); border-radius: 14px; text-align: center; padding: 20px 16px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(243, 230, 207, 0.55);">
                      Official Confirmation ID
                    </p>
                    <p style="margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 24px; font-weight: 700; letter-spacing: 0.16em; color: #f8cf96;">
                      ${registrationId}
                    </p>
                    <p style="margin: 6px 0 0; font-size: 12px; font-weight: 500; color: #4ade80; letter-spacing: 0.04em;">
                      &bull; Registration Confirmed
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Thank-You Letter -->
          <tr>
            <td style="padding: 4px 36px 20px; font-size: 14px; line-height: 1.75; color: rgba(243, 230, 207, 0.88);">
              <p style="margin: 0 0 14px; font-size: 16px; font-weight: 600; color: #f3e6cf;">
                Dear ${name},
              </p>
              <p style="margin: 0 0 14px;">
                Thank you for registering for <strong>HackIEEE 2026–27</strong>. We are thrilled to welcome you to our flagship national 48-hour offline hackathon hosted at Nirma University, Ahmedabad.
              </p>
              <p style="margin: 0;">
                Your participant registration has been successfully received and cataloged in our portal. Our review committee is evaluating applications, and we can&apos;t wait to see the craftsmanship and impact you bring to the finale.
              </p>
            </td>
          </tr>

          <!-- Basic Information Card -->
          <tr>
            <td style="padding: 10px 36px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0e0906; border: 1px solid rgba(248, 207, 150, 0.12); border-radius: 12px; overflow: hidden;">
                <tr>
                  <td colspan="2" style="padding: 12px 18px; border-bottom: 1px solid rgba(248, 207, 150, 0.12); background-color: rgba(248, 207, 150, 0.03);">
                    <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #f8cf96;">
                      Participant Information
                    </span>
                  </td>
                </tr>
                ${basicInfo
                  .map(
                    (item, idx) => `
                <tr>
                  <td width="38%" style="padding: 11px 18px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; letter-spacing: 0.06em; color: rgba(243, 230, 207, 0.55); border-bottom: ${
                    idx < basicInfo.length - 1 ? "1px solid rgba(248, 207, 150, 0.08)" : "none"
                  }; vertical-align: top;">
                    ${item.label}
                  </td>
                  <td width="62%" style="padding: 11px 18px; font-size: 13px; font-weight: 500; color: #f3e6cf; border-bottom: ${
                    idx < basicInfo.length - 1 ? "1px solid rgba(248, 207, 150, 0.08)" : "none"
                  }; vertical-align: top; word-break: break-word;">
                    ${item.value}
                  </td>
                </tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- 'Stay Tuned' Notice -->
          <tr>
            <td style="padding: 4px 36px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(226, 130, 47, 0.06); border-left: 3px solid #e2822f; border-radius: 0 10px 10px 0; padding: 14px 18px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #e2822f;">
                      Stay Tuned
                    </p>
                    <p style="margin: 0; font-size: 12.5px; line-height: 1.6; color: rgba(243, 230, 207, 0.85);">
                      Official problem statements, challenge tracks, and shortlist announcements will be declared on <strong>December 20, 2026</strong>. Keep an eye on your registered inbox for all milestone releases.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Single Clean 'Add to Google Calendar' CTA Button -->
          <tr>
            <td style="padding: 6px 36px 34px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 9999px; background-color: #f8cf96; text-align: center;">
                    <a
                      href="${calendarUrl}"
                      target="_blank"
                      rel="noopener noreferrer"
                      style="display: inline-block; padding: 14px 34px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #1d130a; text-decoration: none; border-radius: 9999px;"
                    >
                      Add to Google Calendar &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Minimalist Footer -->
          <tr>
            <td style="padding: 22px 36px 26px; border-top: 1px solid rgba(248, 207, 150, 0.1); background-color: #0d0906; text-align: center; font-size: 11px; line-height: 1.6; color: rgba(243, 230, 207, 0.5);">
              <p style="margin: 0 0 4px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(243, 230, 207, 0.75);">
                Organised by: IEEE Computer Society at Nirma University
              </p>
              <p style="margin: 0 0 8px;">
                Nirma University, Sarkhej - Gandhinagar Highway, Gota, Ahmedabad, Gujarat 382481
              </p>
              <p style="margin: 0;">
                For any questions or partnerships, reach us at 
                <a href="mailto:contact@hackieee.com" style="color: #f8cf96; text-decoration: none; font-weight: 500;">
                  contact@hackieee.com
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Plain Text Version
  const text = `REGISTRATION CONFIRMED — HACKIEEE 2026-27
======================================================
Official Confirmation ID: ${registrationId}
Status: Confirmed

Dear ${name},

Thank you for registering for HackIEEE 2026-27! We are thrilled to welcome you to our national 48-hour offline hackathon hosted at Nirma University, Ahmedabad.

Your participant registration has been securely received and recorded.

PARTICIPANT INFORMATION
------------------------------------------------------
${basicInfo.map((b) => `${b.label}: ${b.value}`).join("\n")}

STAY TUNED
------------------------------------------------------
Official problem statements, challenge tracks, and shortlist announcements will be declared on December 20, 2026. Keep an eye on your registered inbox for all milestone releases.

EVENT DETAILS
------------------------------------------------------
Event: HackIEEE 2026-27 (48-Hour Offline Finale)
Dates: January 2–4, 2027
Venue: Nirma University, Ahmedabad, Gujarat, India

Add to Google Calendar:
${calendarUrl}

------------------------------------------------------
Organised by: IEEE Computer Society at Nirma University
Support & Enquiries: contact@hackieee.com
`;

  return { subject, html, text };
}
