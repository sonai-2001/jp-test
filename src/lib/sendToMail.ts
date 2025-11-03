import ManageEmail from "@/models/manageEmail";
import * as Brevo from "@getbrevo/brevo";
import { NextResponse } from "next/server";

async function sendToMail(
  email: string,
  emailTemplate: string,
  subject: string
) {
  const brevoApiKey = process.env.BREVO_API_KEY; // Use consistent naming
  const brevoFromEmail = process.env.BREVO_FROM_EMAIL;

  if (!brevoApiKey || !brevoFromEmail) {
    throw new Error("Brevo API key or sender email is not configured.");
  }

  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    brevoApiKey
  );
  const sendSmtpEmail = new Brevo.SendSmtpEmail(); // Use the typed class constructor

  sendSmtpEmail.to = [{ email, name: "Recipient" }];
  sendSmtpEmail.sender = { email: brevoFromEmail, name: "Jaypee Associates" };
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = emailTemplate;

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Brevo email sent. Response:", response.body || response);
    return NextResponse.json(
      { message: "Message has been sent to email." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Brevo email error:", error.response?.body || error.message);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}

export default sendToMail;

type SendToAdminArgs = {
  subject: string;
  html: string;
  text?: string;
  replyTo?: string; // so the admin can reply directly to the user
};

function parseEmails(input?: string | string[]): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter(Boolean).map((s) => s.trim());
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function sendToAdminMail({
  subject,
  html,
  text,
  replyTo,
}: SendToAdminArgs) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoFromEmail = process.env.BREVO_FROM_EMAIL;
  const brevoSenderName = process.env.BREVO_SENDER_NAME || "Jaypee Associates";

  if (!brevoApiKey || !brevoFromEmail) {
    throw new Error("Brevo API key or sender email is not configured.");
  }

  // Ensure DB connection if required in your setup
  // await dbConnect();

  // 1) Fetch recipients from DB
  const emaildData = await ManageEmail.findOne();

  // 2) Extract primary (To) and secondary (CC) from DB
  const primaryTo = (emaildData?.primaryEmail || "").trim();
  const ccCandidates = parseEmails(emaildData?.secondaryEmail as any);

  // 3) Fallback to test emails if DB missing (optional, remove if not needed)
  const toEmail = primaryTo || "sales@jaypeeassociates.com";
  const ccEmails = ccCandidates.length ? ccCandidates : ["jp_ascal@yahoo.com"];

  // 4) Build Brevo payload
  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    brevoApiKey
  );

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.to = toEmail ? [{ email: toEmail, name: "Admin" }] : [];
  sendSmtpEmail.cc = ccEmails.map((email) => ({ email, name: "Admin CC" }));
  sendSmtpEmail.sender = { email: brevoFromEmail, name: brevoSenderName };
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  if (text) sendSmtpEmail.textContent = text;
  if (replyTo) sendSmtpEmail.replyTo = { email: replyTo };

  if (!sendSmtpEmail.to.length) {
    return {
      ok: false,
      error: "No admin recipient (primaryEmail) configured.",
    };
  }

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Brevo email sent. Response:", response?.body || response);
    return { ok: true, response };
  } catch (error: any) {
    console.error(
      "Brevo email error:",
      error?.response?.body || error?.message || error
    );
    return {
      ok: false,
      error: error?.response?.body || error?.message || "Failed to send email.",
    };
  }
}
