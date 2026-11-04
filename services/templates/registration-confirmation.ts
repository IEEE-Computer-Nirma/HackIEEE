/**
 * Registration Confirmation Email Template
 * Branded with IEEE Blue (#3576AE) and Arrakis Dune (#E9CB8E).
 */

export interface RegistrationEmailData {
  name: string;
  email: string;
  registrationId: string;
  college: string;
  track?: string;
}

export function renderRegistrationEmail({
  name,
  email,
  registrationId,
  college,
  track = "General Innovation",
}: RegistrationEmailData) {
  const subject = `Registration Confirmed: HackIEEE 2026-27 [${registrationId}]`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0906; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3e6cf;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0906; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #1a140e; border: 1px solid rgba(241, 214, 172, 0.18); border-radius: 20px; overflow: hidden; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #3576ae, #68aec9, #e9cb8e, #a5663a);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 36px 36px 24px; text-align: center;">
              <span style="display: inline-block; padding: 6px 14px; background: rgba(53, 118, 174, 0.15); border: 1px solid rgba(53, 118, 174, 0.4); border-radius: 999px; font-family: monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #a9d8de;">
                IEEE Computer Society Nirma University
              </span>
              <h1 style="margin: 20px 0 6px; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; color: #e9cb8e;">
                HackIEEE 2026-27
              </h1>
              <p style="margin: 0; font-size: 14px; color: rgba(243, 230, 207, 0.7); letter-spacing: 0.5px;">
                National 48-Hour Offline Hackathon
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 0 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: rgba(18, 13, 9, 0.6); border: 1px solid rgba(233, 203, 142, 0.2); border-radius: 14px; padding: 20px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(243, 230, 207, 0.6);">
                      Official Registration ID
                    </p>
                    <p style="margin: 0; font-family: monospace; font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #e9cb8e;">
                      ${registrationId}
                    </p>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #68aec9;">
                      ✓ Confirmed & Verified
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 28px 36px; font-size: 15px; line-height: 1.7; color: rgba(243, 230, 207, 0.85);">
              <p style="margin: 0 0 16px;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="margin: 0 0 16px;">
                Your registration for <strong>HackIEEE 2026-27</strong> has been officially confirmed! We are thrilled to welcome you to our flagship 48-hour offline hackathon hosted at Nirma University.
              </p>

              <!-- Participant Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0; background: rgba(0,0,0,0.25); border-radius: 10px; padding: 14px;">
                <tr>
                  <td style="padding: 6px 10px; font-size: 13px; color: rgba(243, 230, 207, 0.6);">Participant:</td>
                  <td style="padding: 6px 10px; font-size: 13px; font-weight: 600; color: #f3e6cf;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 10px; font-size: 13px; color: rgba(243, 230, 207, 0.6);">Registered Email:</td>
                  <td style="padding: 6px 10px; font-size: 13px; font-weight: 600; color: #f3e6cf;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 10px; font-size: 13px; color: rgba(243, 230, 207, 0.6);">Institution:</td>
                  <td style="padding: 6px 10px; font-size: 13px; font-weight: 600; color: #f3e6cf;">${college}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 10px; font-size: 13px; color: rgba(243, 230, 207, 0.6);">Selected Track:</td>
                  <td style="padding: 6px 10px; font-size: 13px; font-weight: 600; color: #e9cb8e;">${track}</td>
                </tr>
              </table>

              <!-- Event Details -->
              <h3 style="margin: 24px 0 10px; font-size: 16px; color: #e9cb8e;">Event Briefing</h3>
              <ul style="margin: 0; padding-left: 20px; color: rgba(243, 230, 207, 0.75); font-size: 14px;">
                <li><strong>Dates:</strong> January 2–4, 2027 (48-Hour Continuous Marathon)</li>
                <li><strong>Venue:</strong> Nirma University, SG Highway, Ahmedabad, Gujarat 382481</li>
                <li><strong>Tracks Declaration:</strong> December 20, 2026</li>
              </ul>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 36px 36px; text-align: center;">
              <a href="https://hack.ieeenirma.org" style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #3576ae, #68aec9); color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 20px rgba(53, 118, 174, 0.4);">
                Visit HackIEEE Portal →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: rgba(0, 0, 0, 0.35); text-align: center; border-top: 1px solid rgba(241, 214, 172, 0.08); font-size: 12px; color: rgba(243, 230, 207, 0.45);">
              <p style="margin: 0 0 6px;">
                Organised by IEEE Computer Society Student Branch Chapter, Nirma University
              </p>
              <p style="margin: 0;">
                Questions? Reply directly to this email or reach us at <a href="mailto:deep@computer.org" style="color: #68aec9; text-decoration: none;">deep@computer.org</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `HackIEEE 2026-27 — Registration Confirmed
Registration ID: ${registrationId}

Hi ${name},

Your registration for HackIEEE 2026-27 has been confirmed!

Event Details:
- Dates: January 2–4, 2027 (48-Hour Offline Finale)
- Venue: Nirma University, Ahmedabad, Gujarat, India
- Track: ${track}
- Registered Email: ${email}
- Institution: ${college}

Visit official portal: https://hack.ieeenirma.org
For queries, contact deep@computer.org.
`;

  return { subject, html, text };
}
