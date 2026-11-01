/**
 * Server-only email service for HackIEEE.
 *
 * IMPORTANT: This module must only be imported from server-side code
 * (API routes, Route Handlers, Server Actions, or server components).
 * It reads `process.env` at call time so it never bakes secrets into
 * the client bundle.
 *
 * ### Idempotency note
 * An `Idempotency-Key` header is sent to Resend derived from the
 * `registrationId`. Resend deduplicates requests with the same key
 * within a **24-hour rolling window** — this prevents accidental
 * duplicate sends on transient retries within that window but is NOT
 * a permanent duplicate-prevention guarantee. Your registration
 * backend should also track whether a confirmation email has already
 * been dispatched for each record.
 *
 * @module services/email
 */

import "server-only";

import { createHash } from "node:crypto";
import { Resend } from "resend";

import {
  renderRegistrationConfirmationEmail,
} from "./templates/registration-confirmation";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_FROM = "HackIEEE <hack@ieeenirma.org>";

/**
 * A deliberately permissive email-syntax check.
 * Rejects obviously malformed addresses (no @, no dot in domain, whitespace)
 * without reimplementing full RFC 5322. Real deliverability validation
 * happens at Resend's side.
 */
function isValidEmailSyntax(email: string): boolean {
  // Must have exactly one @, a non-empty local part, and a domain with at
  // least one dot after the @.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Constructs a safe, deterministic, collision-resistant idempotency key for Resend.
 *
 * Requirements:
 * - Scoped with prefix `reg-confirm-` to avoid collisions across email categories.
 * - Uses a deterministic SHA-256 hash of the registration ID to guarantee identical
 *   keys for the same ID while preventing collisions between distinct IDs (even those
 *   containing special characters or very long strings).
 * - Total length is 76 characters (12-char prefix + 64-char hex hash), safely within
 *   Resend's documented 256-character length limit.
 * - Hexadecimal characters [0-9a-f] ensure standard HTTP header safety with no special
 *   or invalid characters.
 */
export function buildRegistrationIdempotencyKey(registrationId: string): string {
  const hash = createHash("sha256")
    .update(registrationId.trim())
    .digest("hex");
  return `reg-confirm-${hash}`;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Returns a Resend client backed by `RESEND_API_KEY`.
 * Throws a descriptive error at *call time* (not module-load time) so
 * build-time imports don't crash when the env var is absent.
 */
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "[email] RESEND_API_KEY environment variable is not set. " +
        "Add it to .env.local (or your deployment environment) before sending emails."
    );
  }
  return new Resend(apiKey);
}

function getSenderAddress(): string {
  return process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM;
}

function getWebsiteUrl(): string | undefined {
  const raw = process.env.HACKIEEE_WEBSITE_URL?.trim();
  return raw || undefined;
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface SendRegistrationConfirmationEmailParams {
  /** Recipient email address. Must be syntactically valid. */
  to: string;
  /** Participant's display name used inside the email body. */
  participantName: string;
  /**
   * Opaque registration identifier displayed to the participant and used
   * as the Resend idempotency key (with a `reg-confirm-` prefix).
   */
  registrationId: string;
}

export interface SendRegistrationConfirmationEmailResult {
  /** Resend message ID returned on success. */
  messageId: string;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Sends a registration confirmation email to a single participant.
 *
 * @throws {TypeError}  When any required parameter is missing, blank, or the
 *                      recipient address fails basic syntax validation.
 * @throws {Error}      When `RESEND_API_KEY` is unset or Resend returns an
 *                      API error. The API key is never included in the message.
 */
export async function sendRegistrationConfirmationEmail(
  params: SendRegistrationConfirmationEmailParams
): Promise<SendRegistrationConfirmationEmailResult> {
  const { to, participantName, registrationId } = params;

  if (!to?.trim()) {
    throw new TypeError(
      "sendRegistrationConfirmationEmail: `to` (recipient email) is required."
    );
  }
  if (!isValidEmailSyntax(to.trim())) {
    throw new TypeError(
      `sendRegistrationConfirmationEmail: \`to\` value "${to.trim()}" is not a valid email address.`
    );
  }
  if (!participantName?.trim()) {
    throw new TypeError(
      "sendRegistrationConfirmationEmail: `participantName` is required."
    );
  }
  if (!registrationId?.trim()) {
    throw new TypeError(
      "sendRegistrationConfirmationEmail: `registrationId` is required."
    );
  }

  // Render template (also validates and HTML-escapes inputs).
  const { subject, html, text } = renderRegistrationConfirmationEmail({
    participantName,
    registrationId,
    websiteUrl: getWebsiteUrl(),
  });

  const resend = getResendClient();

  const idempotencyKey = buildRegistrationIdempotencyKey(registrationId);

  const { data, error } = await resend.emails.send(
    {
      from: getSenderAddress(),
      to: to.trim(),
      subject,
      html,
      text,
      tags: [{ name: "email_type", value: "registration_confirmation" }],
    },
    { idempotencyKey }
  );

  if (error) {
    // Log the structured error shape — never log the API key.
    console.error("[email] Resend API error:", {
      name: error.name,
      statusCode: error.statusCode,
      message: error.message,
    });
    throw new Error(
      `[email] Failed to send registration confirmation: ` +
        `${error.name} (HTTP ${error.statusCode ?? "unknown"}) — ${error.message}`
    );
  }

  if (!data?.id) {
    throw new Error(
      "[email] Resend returned success but no message ID. " +
        "The email may or may not have been queued."
    );
  }

  return { messageId: data.id };
}
