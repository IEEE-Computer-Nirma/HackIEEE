/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
/**
 * Tests for the HackIEEE email service layer.
 *
 * Uses the Node.js built-in test runner (`node:test`) — zero extra
 * test-runner dependencies required.
 *
 * Run via:
 *   npm run test:email
 *
 * The service module (`services/email.ts`) contains `import "server-only"`
 * which throws outside Next.js. We handle this in the test environment by:
 * 1. Hooking `Module._resolveFilename` to intercept `"server-only"` and resolve
 *    it to a safe virtual module stub.
 * 2. Dynamically mocking `resend` in `require.cache` so that
 *    `sendRegistrationConfirmationEmail` can be exercised directly without
 *    network calls.
 */

import assert from "node:assert/strict";
import { describe, it, before, after, beforeEach } from "node:test";
import path from "node:path";
import Module from "node:module";
import { createHash } from "node:crypto";

// ---------------------------------------------------------------------------
// Module Resolution Hook for `server-only` and `@/` aliases
// ---------------------------------------------------------------------------

const originalResolveFilename = (Module as any)._resolveFilename;
const SERVER_ONLY_STUB_ID = path.resolve(__dirname, "../../node_modules/__server_only_stub__.js");

(Module as any)._resolveFilename = function (
  request: string,
  parent: unknown,
  isMain: boolean,
  options: unknown
) {
  if (request === "server-only") {
    return SERVER_ONLY_STUB_ID;
  }
  if (request.startsWith("@/")) {
    const relativePart = request.slice(2);
    return path.resolve(__dirname, "../../out-test", relativePart);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// Seed require.cache for server-only stub so it returns an empty object without disk read
require.cache[SERVER_ONLY_STUB_ID] = {
  id: SERVER_ONLY_STUB_ID,
  filename: SERVER_ONLY_STUB_ID,
  loaded: true,
  exports: {},
  children: [],
  paths: [],
  parent: null,
  path: path.dirname(SERVER_ONLY_STUB_ID),
} as any;

// ---------------------------------------------------------------------------
// Template module — imported directly
// ---------------------------------------------------------------------------

import {
  escapeHtml,
  renderRegistrationConfirmationEmail,
} from "../templates/registration-confirmation.js";

// ---------------------------------------------------------------------------
// Resend mock factory
// ---------------------------------------------------------------------------

type SendResult = {
  data: { id: string } | null;
  error: { name: string; statusCode: number | null; message: string } | null;
};

/** Creates a fresh Resend mock with controllable send behaviour. */
function makeResendMock(sendImpl: (...args: unknown[]) => Promise<SendResult>) {
  return {
    ResendClass: class MockResend {
      apiKey: string;
      emails = {
        send: sendImpl,
      };
      constructor(apiKey?: string) {
        this.apiKey = apiKey ?? "";
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Module loader that pre-injects stubs into require.cache
// ---------------------------------------------------------------------------

/**
 * Loads the compiled email service from out-test, with:
 *   - `server-only`  intercepted via Module._resolveFilename + virtual stub
 *   - `resend`       replaced with the provided mock
 *
 * Returns the module's exports.
 */
function loadEmailService(resendSendImpl: (...args: unknown[]) => Promise<SendResult>) {
  const emailModulePath = path.resolve(__dirname, "../email.js");
  const resendPath = require.resolve("resend");

  // Remove the target module from cache so it re-evaluates with the new stubs.
  delete require.cache[emailModulePath];

  // Stub `resend` — expose a `Resend` constructor that delegates `.emails.send`
  const { ResendClass } = makeResendMock(resendSendImpl);
  require.cache[resendPath] = {
    id: resendPath,
    filename: resendPath,
    loaded: true,
    exports: { Resend: ResendClass },
    children: [],
    paths: [],
    parent: null,
    path: path.dirname(resendPath),
  } as any;

  // Now load the email service module.
  return require(emailModulePath) as typeof import("../email.js");
}

// Restore cache mutations between service tests.
function cleanupEmailServiceCache() {
  const emailModulePath = path.resolve(__dirname, "../email.js");
  try {
    const resendPath = require.resolve("resend");
    delete require.cache[resendPath];
  } catch {
    // ignore
  }
  delete require.cache[emailModulePath];
}

// ---------------------------------------------------------------------------
// Helpers and fixtures
// ---------------------------------------------------------------------------

const SUCCESS_RESPONSE = { data: { id: "msg_abc123" }, error: null };
const validParams = {
  to: "participant@example.com",
  participantName: "Alice Example",
  registrationId: "HACK-2026-0001",
};

// ---------------------------------------------------------------------------
// escapeHtml — pure unit tests
// ---------------------------------------------------------------------------

describe("escapeHtml", () => {
  it("leaves plain ASCII untouched", () => {
    assert.equal(escapeHtml("Hello World 123"), "Hello World 123");
  });

  it("escapes & < > \" '", () => {
    assert.equal(
      escapeHtml(`<script>alert("xss & '1'")</script>`),
      "&lt;script&gt;alert(&quot;xss &amp; &#x27;1&#x27;&quot;)&lt;/script&gt;"
    );
  });

  it("handles empty string", () => {
    assert.equal(escapeHtml(""), "");
  });

  it("does not double-escape (is not idempotent)", () => {
    assert.equal(escapeHtml("&"), "&amp;");
    assert.equal(escapeHtml("&amp;"), "&amp;amp;");
  });
});

// ---------------------------------------------------------------------------
// renderRegistrationConfirmationEmail — validation
// ---------------------------------------------------------------------------

describe("renderRegistrationConfirmationEmail — input validation", () => {
  it("throws TypeError when participantName is empty", () => {
    assert.throws(
      () => renderRegistrationConfirmationEmail({ participantName: "", registrationId: "REG-001" }),
      (err: unknown) => err instanceof TypeError
    );
  });

  it("throws TypeError when participantName is only whitespace", () => {
    assert.throws(
      () => renderRegistrationConfirmationEmail({ participantName: "   ", registrationId: "REG-001" }),
      (err: unknown) => err instanceof TypeError
    );
  });

  it("throws TypeError when registrationId is empty", () => {
    assert.throws(
      () => renderRegistrationConfirmationEmail({ participantName: "Alice", registrationId: "" }),
      (err: unknown) => err instanceof TypeError
    );
  });

  it("throws TypeError when registrationId is only whitespace", () => {
    assert.throws(
      () => renderRegistrationConfirmationEmail({ participantName: "Alice", registrationId: "   " }),
      (err: unknown) => err instanceof TypeError
    );
  });
});

// ---------------------------------------------------------------------------
// renderRegistrationConfirmationEmail — output shape and content
// ---------------------------------------------------------------------------

describe("renderRegistrationConfirmationEmail — output", () => {
  const PARAMS = { participantName: "Palak Sinojia", registrationId: "HACK-2026-0042" };

  it("returns subject, html, and text fields", () => {
    const result = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(typeof result.subject === "string" && result.subject.length > 0, "subject missing");
    assert.ok(typeof result.html === "string" && result.html.length > 0, "html missing");
    assert.ok(typeof result.text === "string" && result.text.length > 0, "text missing");
  });

  it("includes participant name in HTML body", () => {
    const { html } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(html.includes("Palak Sinojia"), "name not in HTML body");
  });

  it("includes registration ID in HTML body", () => {
    const { html } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(html.includes("HACK-2026-0042"), "reg ID not in HTML body");
  });

  it("includes participant name in plain-text body", () => {
    const { text } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(text.includes("Palak Sinojia"), "name not in plain-text");
  });

  it("includes registration ID in plain-text body", () => {
    const { text } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(text.includes("HACK-2026-0042"), "reg ID not in plain-text");
  });

  it("HTML-escapes XSS in participantName", () => {
    const { html } = renderRegistrationConfirmationEmail({
      participantName: '<img src=x onerror=alert(1)>',
      registrationId: "HACK-SAFE-001",
    });
    assert.ok(!html.includes("<img"), "raw <img> must not appear");
    assert.ok(html.includes("&lt;img"), "escaped &lt;img must appear");
  });

  it("HTML-escapes XSS in registrationId", () => {
    const { html } = renderRegistrationConfirmationEmail({
      participantName: "Safe User",
      registrationId: '"><script>evil()</script>',
    });
    assert.ok(!html.includes("<script>"), "raw <script> must not appear");
    assert.ok(html.includes("&lt;script&gt;"), "escaped tag must appear");
  });

  it("trims whitespace from inputs before insertion", () => {
    const { html, text } = renderRegistrationConfirmationEmail({
      participantName: "  Alice  ",
      registrationId: "  REG-TRIM  ",
    });
    assert.ok(html.includes("Alice") && !html.includes("  Alice  "), "name should be trimmed in HTML");
    assert.ok(text.includes("REG-TRIM"), "ID should be trimmed in text");
  });

  it("HTML starts with <!DOCTYPE html>", () => {
    const { html } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(html.trimStart().startsWith("<!DOCTYPE html>"));
  });

  it("HTML contains a <title> element", () => {
    const { html } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(html.includes("<title>"), "HTML should have <title>");
  });

  it("HTML contains a viewport meta tag for mobile", () => {
    const { html } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(html.includes("viewport"), "HTML should include viewport meta");
  });

  it("plain-text contains the support email address", () => {
    const { text } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(text.includes("hack@ieeenirma.org"), "text should contain support email");
  });

  it("CTA button is omitted when websiteUrl is not provided", () => {
    const { html, text } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(!html.includes("Visit HackIEEE &rarr;"), "CTA button should not appear without websiteUrl");
    assert.ok(!text.includes("Visit HackIEEE:"), "CTA text should not appear without websiteUrl");
  });

  it("CTA button is included when websiteUrl is provided", () => {
    const { html, text } = renderRegistrationConfirmationEmail({
      ...PARAMS,
      websiteUrl: "https://hack.ieeenirma.org",
    });
    assert.ok(html.includes("Visit HackIEEE"), "CTA button should appear when websiteUrl given");
    assert.ok(text.includes("https://hack.ieeenirma.org"), "URL should be in plain-text");
  });

  it("websiteUrl is HTML-escaped in the CTA", () => {
    const { html } = renderRegistrationConfirmationEmail({
      ...PARAMS,
      websiteUrl: 'https://example.com/?a=1&b=<2>',
    });
    assert.ok(!html.includes("&b=<2>"), "unescaped angle bracket must not appear");
    assert.ok(html.includes("&amp;b=&lt;2&gt;") || html.includes("&b=&lt;2&gt;"), "URL should be escaped");
  });

  it("uses warm sand/spice brand colors (#0b0906, #e2822f, #ffa64d, #f3e6cf), not purple", () => {
    const { html } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(html.includes("#e2822f"), "should use spice-orange accent (#e2822f)");
    assert.ok(html.includes("#ffa64d"), "should use spice-hot highlight (#ffa64d)");
    assert.ok(html.includes("#f3e6cf"), "should use warm cream text (#f3e6cf)");
    assert.ok(!html.includes("#7c6af7"), "should not use old purple accent");
  });

  it("uses the dark desert background color (#0b0906)", () => {
    const { html } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(html.includes("#0b0906"), "should use dark desert background");
  });

  it("does not claim registration ID is required for check-in", () => {
    const { html, text } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(!html.toLowerCase().includes("check-in"), "html should not mention check-in");
    assert.ok(!text.toLowerCase().includes("check-in"), "text should not mention check-in");
  });

  it("does not say 'do not reply' since replies go to the support address", () => {
    const { html, text } = renderRegistrationConfirmationEmail(PARAMS);
    assert.ok(!html.toLowerCase().includes("do not reply"), "html should not say 'do not reply'");
    assert.ok(!text.toLowerCase().includes("do not reply"), "text should not say 'do not reply'");
  });
});

// ---------------------------------------------------------------------------
// buildRegistrationIdempotencyKey — SHA-256 hash unit tests
// ---------------------------------------------------------------------------

describe("buildRegistrationIdempotencyKey", () => {
  it("keeps the reg-confirm- prefix", () => {
    const { buildRegistrationIdempotencyKey } = loadEmailService(async () => SUCCESS_RESPONSE);
    const key = buildRegistrationIdempotencyKey("REG-1234");
    assert.ok(key.startsWith("reg-confirm-"), `key ${key} should start with reg-confirm-`);
  });

  it("produces deterministic, stable output for identical registration IDs", () => {
    const { buildRegistrationIdempotencyKey } = loadEmailService(async () => SUCCESS_RESPONSE);
    const key1 = buildRegistrationIdempotencyKey("HACK-2026-0042");
    const key2 = buildRegistrationIdempotencyKey("HACK-2026-0042");
    assert.equal(key1, key2, "same ID must produce identical idempotency key");

    const expectedHash = createHash("sha256").update("HACK-2026-0042").digest("hex");
    assert.equal(key1, `reg-confirm-${expectedHash}`);
  });

  it("trims whitespace before hashing so untrimmed inputs yield identical keys", () => {
    const { buildRegistrationIdempotencyKey } = loadEmailService(async () => SUCCESS_RESPONSE);
    const keyTrimmed = buildRegistrationIdempotencyKey("REG-001");
    const keyUntrimmed = buildRegistrationIdempotencyKey("   REG-001   ");
    assert.equal(keyTrimmed, keyUntrimmed, "untrimmed input must yield same key as trimmed");
  });

  it("produces distinct keys for distinct registration IDs (prevents collisions)", () => {
    const { buildRegistrationIdempotencyKey } = loadEmailService(async () => SUCCESS_RESPONSE);
    const keyA = buildRegistrationIdempotencyKey("REG-001");
    const keyB = buildRegistrationIdempotencyKey("REG-002");
    assert.notEqual(keyA, keyB, "distinct IDs must produce distinct keys");
  });

  it("prevents collisions between IDs with different special characters", () => {
    const { buildRegistrationIdempotencyKey } = loadEmailService(async () => SUCCESS_RESPONSE);
    // Distinct strings with special characters must never collide:
    const variants = ["REG/1", "REG:1", "REG-1", "REG_1", "REG.1", "REG 1"];
    const keys = new Set(variants.map((v) => buildRegistrationIdempotencyKey(v)));
    assert.equal(
      keys.size,
      variants.length,
      `all ${variants.length} variants must produce unique keys, but got ${keys.size}`
    );
  });

  it("handles Unicode and emoji in registration IDs safely and distinctly", () => {
    const { buildRegistrationIdempotencyKey } = loadEmailService(async () => SUCCESS_RESPONSE);
    const key1 = buildRegistrationIdempotencyKey("REG-🚀-01");
    const key2 = buildRegistrationIdempotencyKey("REG-🎉-01");
    assert.notEqual(key1, key2);
    assert.ok(/^[a-z0-9-]+$/.test(key1), "key should only contain lowercase hex and prefix");
  });

  it("produces keys strictly within Resend length limits (76 chars <= 256)", () => {
    const { buildRegistrationIdempotencyKey } = loadEmailService(async () => SUCCESS_RESPONSE);
    const key = buildRegistrationIdempotencyKey("STANDARD-ID-123");
    // "reg-confirm-" (12 chars) + SHA256 hex (64 chars) = 76 chars
    assert.equal(key.length, 76);
    assert.ok(key.length <= 256, "key must be <= 256 characters");
  });

  it("handles very long registration IDs while staying strictly within length limits", () => {
    const { buildRegistrationIdempotencyKey } = loadEmailService(async () => SUCCESS_RESPONSE);
    const veryLongIdA = "X".repeat(5000);
    const veryLongIdB = "X".repeat(4999) + "Y";

    const keyA = buildRegistrationIdempotencyKey(veryLongIdA);
    const keyB = buildRegistrationIdempotencyKey(veryLongIdB);

    assert.equal(keyA.length, 76, "long ID key length should remain exactly 76 chars");
    assert.equal(keyB.length, 76, "long ID key length should remain exactly 76 chars");
    assert.ok(keyA.length <= 256, "keyA must be <= 256 characters");
    assert.ok(keyB.length <= 256, "keyB must be <= 256 characters");
    assert.notEqual(keyA, keyB, "different long IDs must produce different keys");
  });
});

// ---------------------------------------------------------------------------
// sendRegistrationConfirmationEmail — service tests via mocked Resend
// ---------------------------------------------------------------------------

describe("sendRegistrationConfirmationEmail", () => {
  let savedEnv: NodeJS.ProcessEnv;

  before(() => {
    savedEnv = { ...process.env };
  });

  after(() => {
    process.env = savedEnv;
    cleanupEmailServiceCache();
    delete require.cache[SERVER_ONLY_STUB_ID];
    (Module as any)._resolveFilename = originalResolveFilename;
  });

  beforeEach(() => {
    process.env = { ...savedEnv };
    process.env.RESEND_API_KEY = "re_test_fake_key";
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.HACKIEEE_WEBSITE_URL;
    cleanupEmailServiceCache();
  });

  it("returns the message ID on a successful Resend response", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(
      async () => SUCCESS_RESPONSE
    );
    const result = await sendRegistrationConfirmationEmail(validParams);
    assert.equal(result.messageId, "msg_abc123");
  });

  it("calls resend.emails.send exactly once per invocation", async () => {
    let callCount = 0;
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => {
      callCount++;
      return SUCCESS_RESPONSE;
    });
    await sendRegistrationConfirmationEmail(validParams);
    assert.equal(callCount, 1, "Resend send should be called exactly once");
  });

  it("sends from the default address when RESEND_FROM_EMAIL is not set", async () => {
    let capturedPayload: Record<string, unknown> = {};
    const { sendRegistrationConfirmationEmail } = loadEmailService(async (payload) => {
      capturedPayload = payload as Record<string, unknown>;
      return SUCCESS_RESPONSE;
    });
    await sendRegistrationConfirmationEmail(validParams);
    assert.ok(
      String(capturedPayload.from ?? "").includes("hack@ieeenirma.org"),
      `from should contain hack@ieeenirma.org, got: ${capturedPayload.from}`
    );
  });

  it("uses RESEND_FROM_EMAIL when set", async () => {
    process.env.RESEND_FROM_EMAIL = "Custom Sender <custom@example.com>";
    let capturedPayload: Record<string, unknown> = {};
    const { sendRegistrationConfirmationEmail } = loadEmailService(async (payload) => {
      capturedPayload = payload as Record<string, unknown>;
      return SUCCESS_RESPONSE;
    });
    await sendRegistrationConfirmationEmail(validParams);
    assert.equal(capturedPayload.from, "Custom Sender <custom@example.com>");
  });

  it("passes the correct idempotency key to Resend (reg-confirm- prefix + SHA-256)", async () => {
    let capturedOptions: Record<string, unknown> = {};
    const { sendRegistrationConfirmationEmail, buildRegistrationIdempotencyKey } = loadEmailService(
      async (_payload, options) => {
        capturedOptions = options as Record<string, unknown>;
        return SUCCESS_RESPONSE;
      }
    );
    await sendRegistrationConfirmationEmail(validParams);
    const expectedKey = buildRegistrationIdempotencyKey(validParams.registrationId);
    assert.equal(
      capturedOptions.idempotencyKey,
      expectedKey,
      "idempotency key passed to Resend should match buildRegistrationIdempotencyKey"
    );
    assert.equal((capturedOptions.idempotencyKey as string).length, 76);
  });

  it("passes compliant idempotency key even with long registrationId (<= 256 chars)", async () => {
    let capturedOptions: Record<string, unknown> = {};
    const { sendRegistrationConfirmationEmail, buildRegistrationIdempotencyKey } = loadEmailService(
      async (_payload, options) => {
        capturedOptions = options as Record<string, unknown>;
        return SUCCESS_RESPONSE;
      }
    );
    const longId = "VERY-LONG-REG-ID-".repeat(30);
    await sendRegistrationConfirmationEmail({
      ...validParams,
      registrationId: longId,
    });
    const key = capturedOptions.idempotencyKey as string;
    assert.ok(typeof key === "string");
    assert.equal(key.length, 76, `idempotencyKey length ${key.length} must be 76`);
    assert.ok(key.length <= 256, `idempotencyKey length ${key.length} must be <= 256`);
    assert.equal(key, buildRegistrationIdempotencyKey(longId));
  });

  it("sends to the correct trimmed recipient address", async () => {
    let capturedTo = "";
    const { sendRegistrationConfirmationEmail } = loadEmailService(async (payload) => {
      capturedTo = (payload as Record<string, unknown>).to as string;
      return SUCCESS_RESPONSE;
    });
    await sendRegistrationConfirmationEmail({ ...validParams, to: "  user@example.com  " });
    assert.equal(capturedTo, "user@example.com");
  });

  it("passes configured HACKIEEE_WEBSITE_URL to email body", async () => {
    process.env.HACKIEEE_WEBSITE_URL = "https://hack.ieeenirma.org";
    let capturedPayload: Record<string, unknown> = {};
    const { sendRegistrationConfirmationEmail } = loadEmailService(async (payload) => {
      capturedPayload = payload as Record<string, unknown>;
      return SUCCESS_RESPONSE;
    });
    await sendRegistrationConfirmationEmail(validParams);
    const html = capturedPayload.html as string;
    const text = capturedPayload.text as string;
    assert.ok(html.includes("https://hack.ieeenirma.org"), "html should contain website URL");
    assert.ok(text.includes("https://hack.ieeenirma.org"), "text should contain website URL");
  });

  it("omits CTA from email body when HACKIEEE_WEBSITE_URL is not set", async () => {
    delete process.env.HACKIEEE_WEBSITE_URL;
    let capturedPayload: Record<string, unknown> = {};
    const { sendRegistrationConfirmationEmail } = loadEmailService(async (payload) => {
      capturedPayload = payload as Record<string, unknown>;
      return SUCCESS_RESPONSE;
    });
    await sendRegistrationConfirmationEmail(validParams);
    const html = capturedPayload.html as string;
    const text = capturedPayload.text as string;
    assert.ok(!html.includes("Visit HackIEEE"), "html should not contain CTA");
    assert.ok(!text.includes("Visit HackIEEE:"), "text should not contain CTA");
  });

  it("throws when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const { sendRegistrationConfirmationEmail } = loadEmailService(
      async () => SUCCESS_RESPONSE
    );
    await assert.rejects(
      () => sendRegistrationConfirmationEmail(validParams),
      (err: unknown) => err instanceof Error && (err as Error).message.includes("RESEND_API_KEY")
    );
  });

  it("throws when Resend returns an API error", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => ({
      data: null,
      error: { name: "rate_limit_exceeded" as const, statusCode: 429, message: "Too many requests" },
    }));
    await assert.rejects(
      () => sendRegistrationConfirmationEmail(validParams),
      (err: unknown) =>
        err instanceof Error &&
        (err as Error).message.includes("rate_limit_exceeded") &&
        (err as Error).message.includes("429")
    );
  });

  it("throws when Resend returns success without a message ID", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => ({
      data: null,
      error: null,
    }));
    await assert.rejects(
      () => sendRegistrationConfirmationEmail(validParams),
      (err: unknown) =>
        err instanceof Error &&
        (err as Error).message.includes("Resend returned success but no message ID")
    );
  });

  it("does not include the API key in the error message", async () => {
    const fakeKey = "re_super_secret_key_xyz";
    process.env.RESEND_API_KEY = fakeKey;
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => ({
      data: null,
      error: { name: "application_error" as const, statusCode: 500, message: "Internal error" },
    }));
    await assert.rejects(
      () => sendRegistrationConfirmationEmail(validParams),
      (err: unknown) => {
        assert.ok(err instanceof Error, "should throw an Error");
        assert.ok(
          !(err as Error).message.includes(fakeKey),
          "error message must not contain the API key"
        );
        return true;
      }
    );
  });

  it("throws TypeError when `to` is empty", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => SUCCESS_RESPONSE);
    await assert.rejects(
      () => sendRegistrationConfirmationEmail({ ...validParams, to: "" }),
      (err: unknown) => err instanceof TypeError
    );
  });

  it("throws TypeError when `to` is only whitespace", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => SUCCESS_RESPONSE);
    await assert.rejects(
      () => sendRegistrationConfirmationEmail({ ...validParams, to: "   " }),
      (err: unknown) => err instanceof TypeError
    );
  });

  it("throws TypeError when `to` fails basic email syntax validation", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => SUCCESS_RESPONSE);
    for (const invalid of ["notanemail", "missing@dot", "@nodomain.com", "two@@signs.com"]) {
      await assert.rejects(
        () => sendRegistrationConfirmationEmail({ ...validParams, to: invalid }),
        (err: unknown) => err instanceof TypeError,
        `should reject invalid email: ${invalid}`
      );
    }
  });

  it("accepts syntactically valid email addresses", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => SUCCESS_RESPONSE);
    for (const valid of [
      "user@example.com",
      "user+tag@sub.example.org",
      "User.Name@Example.Co.In",
    ]) {
      await assert.doesNotReject(
        () => sendRegistrationConfirmationEmail({ ...validParams, to: valid }),
        `should accept valid email: ${valid}`
      );
    }
  });

  it("throws TypeError when participantName is blank", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => SUCCESS_RESPONSE);
    await assert.rejects(
      () => sendRegistrationConfirmationEmail({ ...validParams, participantName: "" }),
      (err: unknown) => err instanceof TypeError
    );
  });

  it("throws TypeError when registrationId is blank", async () => {
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => SUCCESS_RESPONSE);
    await assert.rejects(
      () => sendRegistrationConfirmationEmail({ ...validParams, registrationId: "" }),
      (err: unknown) => err instanceof TypeError
    );
  });

  it("makes no real network calls (Resend is fully mocked)", async () => {
    let mockWasCalled = false;
    const { sendRegistrationConfirmationEmail } = loadEmailService(async () => {
      mockWasCalled = true;
      return SUCCESS_RESPONSE;
    });
    await sendRegistrationConfirmationEmail(validParams);
    assert.ok(mockWasCalled, "Resend mock should have been called (no real network request)");
  });
});
