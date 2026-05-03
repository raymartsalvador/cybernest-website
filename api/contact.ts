import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? "cns@cybernestsolution.com";
const CONTACT_FROM =
  process.env.CONTACT_FROM_EMAIL ??
  "Cybernest Website <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!RESEND_API_KEY) {
    console.error("contact: RESEND_API_KEY not configured");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const consent = body.consent === true;
  const honeypot = typeof body.website === "string" ? body.website : "";

  // Bot caught by honeypot — silently succeed.
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  if (!name || name.length > 100) {
    return res.status(400).json({ error: "Please provide a valid name." });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }
  if (!message || message.length > 5000) {
    return res.status(400).json({ error: "Please provide a message." });
  }
  if (!consent) {
    return res.status(400).json({ error: "Consent is required." });
  }

  const subject = `New website message from ${name}`;
  const html = `
    <h2 style="font-family:system-ui,sans-serif">New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escapeHtml(message)}</p>
  `;
  const text = `New contact form submission

Name: ${name}
Email: ${email}

Message:
${message}
`;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("contact resend error:", error);
      return res.status(502).json({ error: "Failed to send message." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact handler error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
