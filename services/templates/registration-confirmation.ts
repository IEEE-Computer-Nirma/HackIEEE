/**
 * Registration confirmation email template for HackIEEE.
 *
 * Produces both an HTML body and a plain-text fallback.
 * All caller-supplied strings are escaped before insertion into HTML
 * so that no user input can inject markup.
 *
 * Branding follows the site's Arrakis/desert design tokens:
 *   background  #0b0906  (deep dark brown)
 *   surface     #1a140e  (slightly lighter dark)
 *   accent      #e2822f  (spice orange)
 *   accent-hot  #ffa64d  (highlight)
 *   text        #f3e6cf  (warm cream)
 *   text-muted  rgba(243,230,207,0.74)
 *   line        rgba(241,214,172,0.13)
 *
 * @module services/templates/registration-confirmation
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegistrationConfirmationTemplateData {
  /** Recipient's display name. */
  participantName: string;
  /** Opaque registration identifier shown to the participant. */
  registrationId: string;
  /**
   * Optional URL to include as a CTA button.
   * When omitted the CTA section is not rendered.
   */
  websiteUrl?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

// ---------------------------------------------------------------------------
// HTML escaping
// ---------------------------------------------------------------------------

/**
 * Escapes the five characters meaningful inside HTML text / attribute values.
 * Sufficient for inserting user-supplied strings into quoted HTML contexts;
 * NOT a substitute for a full sanitiser.
 */
export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

/**
 * Returns the fully-rendered subject, HTML body, and plain-text body for a
 * registration confirmation email.
 *
 * @throws {TypeError} if any required field is missing or blank.
 */
export function renderRegistrationConfirmationEmail(
  data: RegistrationConfirmationTemplateData
): RenderedEmail {
  const { participantName, registrationId, websiteUrl } = data;

  if (!participantName?.trim()) {
    throw new TypeError(
      "renderRegistrationConfirmationEmail: participantName is required and must not be blank."
    );
  }
  if (!registrationId?.trim()) {
    throw new TypeError(
      "renderRegistrationConfirmationEmail: registrationId is required and must not be blank."
    );
  }

  const safeName    = escapeHtml(participantName.trim());
  const safeId      = escapeHtml(registrationId.trim());
  const nameRaw     = participantName.trim();
  const idRaw       = registrationId.trim();
  const safeUrl     = websiteUrl ? escapeHtml(websiteUrl.trim()) : null;

  const subject = "Your HackIEEE registration is confirmed";

  /* -------------------------------------------------------------------------
   * Colour palette (Arrakis / desert theme matching the website)
   *   --bg:          #0b0906   deep dark-brown background
   *   --bg-2:        #120d09   card background
   *   --surface:     #1a140e   highlighted surfaces
   *   --spice:       #e2822f   primary accent (orange)
   *   --spice-hot:   #ffa64d   bright highlights
   *   --text:        #f3e6cf   warm cream body text
   *   --text-2:      rgba(243,230,207,0.74)   muted text
   *   --line:        rgba(241,214,172,0.13)   subtle borders
   *   --line-strong: rgba(241,214,172,0.26)   visible borders
   * ----------------------------------------------------------------------- */

  // CTA button block — only emitted when a websiteUrl is configured.
  const ctaHtml = safeUrl
    ? `
            <!-- CTA -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:32px;">
              <tr>
                <td style="text-align:center;">
                  <a href="${safeUrl}"
                     style="display:inline-block;background:linear-gradient(135deg,#e2822f 0%,#c4501b 100%);border-radius:10px;color:#1d130a;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:700;padding:14px 36px;text-decoration:none;letter-spacing:0.3px;">
                    Visit HackIEEE &rarr;
                  </a>
                </td>
              </tr>
            </table>`
    : "";

  /* -------------------------------------------------------------------------
   * HTML body
   * ----------------------------------------------------------------------- */
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>HackIEEE &mdash; Registration Confirmed</title>
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
    img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none}
    body{margin:0!important;padding:0!important;background-color:#0b0906;width:100%!important}
    @media only screen and (max-width:480px){
      .body-content{padding:28px 20px 24px!important}
      .email-header{padding:36px 20px 28px!important}
      .email-footer{padding:20px!important}
    }
  </style>
</head>
<body style="background-color:#0b0906;margin:0;padding:0;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0b0906;">
  <tr>
    <td style="padding:40px 16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
             style="max-width:600px;margin:0 auto;background-color:#120d09;border-radius:16px;border:1px solid rgba(241,214,172,0.18);overflow:hidden;">

        <!-- Header -->
        <tr>
          <td class="email-header"
              style="background:linear-gradient(160deg,#1d130a 0%,#120d09 60%,#17100a 100%);padding:48px 40px 36px;text-align:center;border-bottom:1px solid rgba(241,214,172,0.1);">
            <div style="display:inline-block;background:rgba(226,130,47,0.12);border:1px solid rgba(226,130,47,0.35);border-radius:100px;padding:6px 18px;margin-bottom:24px;">
              <span style="color:#ffa64d;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;">&#10003; Registration Confirmed</span>
            </div>
            <p style="color:#f3e6cf;font-family:'Segoe UI',Arial,sans-serif;font-size:30px;font-weight:800;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;line-height:1.1;">hackieee</p>
            <p style="color:rgba(243,230,207,0.55);font-family:'Segoe UI',Arial,sans-serif;font-size:13px;margin:0;letter-spacing:0.5px;">IEEE Computer Society &mdash; Nirma University</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td class="body-content" style="padding:36px 40px 28px;">
            <h1 style="color:#f3e6cf;font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:700;margin:0 0 14px;line-height:1.3;">
              Welcome, ${safeName}!
            </h1>
            <p style="color:rgba(243,230,207,0.74);font-family:'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.75;margin:0 0 28px;">
              Your registration for <strong style="color:#f3e6cf;">HackIEEE</strong> has been received and confirmed.
              We&rsquo;re glad to have you on board &mdash; more details will follow as the event approaches.
            </p>

            <!-- Registration ID box -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:rgba(226,130,47,0.07);border:1px solid rgba(226,130,47,0.28);border-radius:10px;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="color:rgba(243,230,207,0.5);font-family:'Segoe UI',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;margin:0 0 8px;">Registration ID</p>
                  <p style="color:#ffa64d;font-family:'Courier New',Courier,monospace;font-size:19px;font-weight:700;letter-spacing:2px;margin:0;word-break:break-all;">${safeId}</p>
                </td>
              </tr>
            </table>

            <!-- What's next -->
            <p style="color:#f3e6cf;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:700;margin:0 0 16px;">What happens next?</p>

            <!-- Step 1 -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:14px;width:100%;">
              <tr>
                <td valign="top" width="36" style="padding-right:12px;padding-top:2px;">
                  <div style="background:linear-gradient(135deg,#e2822f,#c4501b);border-radius:50%;color:#1d130a;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:800;width:26px;height:26px;line-height:26px;text-align:center;">1</div>
                </td>
                <td>
                  <p style="color:rgba(243,230,207,0.74);font-family:'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.65;margin:0;">
                    <strong style="color:#f3e6cf;">Keep your Registration ID</strong> &mdash; reference it in any correspondence with the organising team.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Step 2 -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:14px;width:100%;">
              <tr>
                <td valign="top" width="36" style="padding-right:12px;padding-top:2px;">
                  <div style="background:linear-gradient(135deg,#e2822f,#c4501b);border-radius:50%;color:#1d130a;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:800;width:26px;height:26px;line-height:26px;text-align:center;">2</div>
                </td>
                <td>
                  <p style="color:rgba(243,230,207,0.74);font-family:'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.65;margin:0;">
                    <strong style="color:#f3e6cf;">Follow our socials</strong> &mdash; announcements, team-formation posts, and updates will go out there first.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Step 3 -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;width:100%;">
              <tr>
                <td valign="top" width="36" style="padding-right:12px;padding-top:2px;">
                  <div style="background:linear-gradient(135deg,#e2822f,#c4501b);border-radius:50%;color:#1d130a;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:800;width:26px;height:26px;line-height:26px;text-align:center;">3</div>
                </td>
                <td>
                  <p style="color:rgba(243,230,207,0.74);font-family:'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.65;margin:0;">
                    <strong style="color:#f3e6cf;">Watch your inbox</strong> &mdash; we&rsquo;ll be in touch with further event information closer to the date.
                  </p>
                </td>
              </tr>
            </table>
${ctaHtml}
            <!-- Divider -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:22px;">
              <tr>
                <td style="border-top:1px solid rgba(241,214,172,0.1);font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>

            <!-- Support note -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:rgba(226,130,47,0.06);border-left:3px solid rgba(226,130,47,0.5);border-radius:4px;padding:14px 16px;">
                  <p style="color:rgba(243,230,207,0.65);font-family:'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.65;margin:0;">
                    Questions or corrections? Reply to this email or write to
                    <a href="mailto:hack@ieeenirma.org" style="color:#ffa64d;text-decoration:none;">hack@ieeenirma.org</a>
                    and include your Registration ID.
                  </p>
                </td>
              </tr>
            </table>

            <p style="color:rgba(243,230,207,0.74);font-family:'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.75;margin:0;">
              We can&rsquo;t wait to see what you&rsquo;ll build. See you there!
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="email-footer"
              style="background:rgba(0,0,0,0.3);padding:24px 40px;text-align:center;border-top:1px solid rgba(241,214,172,0.08);">
            <p style="color:rgba(243,230,207,0.45);font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;line-height:1.7;margin:0 0 4px;">
              IEEE Computer Society &mdash; Nirma University
            </p>
            <p style="color:rgba(243,230,207,0.3);font-family:'Segoe UI',Arial,sans-serif;font-size:11px;line-height:1.7;margin:0 0 4px;">
              Nirma University, Ahmedabad, Gujarat, India
            </p>
            <p style="color:rgba(243,230,207,0.3);font-family:'Segoe UI',Arial,sans-serif;font-size:11px;line-height:1.7;margin:0;">
              <a href="mailto:hack@ieeenirma.org" style="color:rgba(243,230,207,0.4);text-decoration:none;">hack@ieeenirma.org</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  /* -------------------------------------------------------------------------
   * Plain-text body
   * ----------------------------------------------------------------------- */
  const ctaText = safeUrl
    ? [
        "",
        `Visit HackIEEE: ${websiteUrl!.trim()}`,
      ].join("\n")
    : "";

  const text = [
    "==========================================================",
    "  HackIEEE - Registration Confirmed",
    "  IEEE Computer Society - Nirma University",
    "==========================================================",
    "",
    `Hi ${nameRaw},`,
    "",
    "Your registration for HackIEEE has been confirmed.",
    "We're glad to have you on board.",
    "",
    "  REGISTRATION ID",
    "  ---------------",
    `  ${idRaw}`,
    "",
    "Keep this ID and reference it in any correspondence",
    "with the organising team.",
    "",
    "----------------------------------------------------------",
    "WHAT HAPPENS NEXT?",
    "----------------------------------------------------------",
    "",
    "  1. Keep your Registration ID.",
    "",
    "  2. Follow our socials for announcements, team-formation",
    "     posts, and updates.",
    "",
    "  3. Watch your inbox - we'll be in touch with further",
    "     event information closer to the date.",
    ctaText,
    "----------------------------------------------------------",
    "",
    "Questions or corrections? Reply to this email or write",
    "to hack@ieeenirma.org and include your Registration ID.",
    "",
    "We can't wait to see what you'll build. See you there!",
    "",
    "----------------------------------------------------------",
    "IEEE Computer Society - Nirma University",
    "Nirma University, Ahmedabad, Gujarat, India",
    "hack@ieeenirma.org",
    "==========================================================",
  ].join("\n");

  return { subject, html, text };
}
