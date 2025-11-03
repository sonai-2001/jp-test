// utils/emailTemplates.ts
export type ConnectUsPayload = {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  
  const escapeHtml = (v: string) =>
    String(v).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m] as string));
  
  export function buildConnectUsAdminHtml(data: ConnectUsPayload) {
    const brandColor = "#0ea5e9"; // Change to your brand color
    const bgColor = "#f6f9fc";
    const cardBg = "#ffffff";
    const textColor = "#0f172a";
    const labelColor = "#64748b";
    const borderColor = "#e5e7eb";
  
    const name = escapeHtml(data.name || "");
    const email = escapeHtml(data.email || "");
    const phone = escapeHtml(data.phone || "");
    const message = escapeHtml(data.message || "").replace(/\n/g, "<br>");
  
    const preheader = `New contact submission from ${name}`;
  
    return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <meta name="x-apple-disable-message-reformatting">
      <title>New Contact Submission</title>
    </head>
    <body style="margin:0; padding:0; background:${bgColor};">
      <!-- Preheader (hidden) -->
      <div style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all;">
        ${preheader}
      </div>
  
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${bgColor};">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background:${cardBg}; border:1px solid ${borderColor}; border-radius:12px; overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="background:${brandColor}; padding:20px 24px; color:#ffffff; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
                  <div style="font-size:12px; opacity:0.9; letter-spacing:.3px;">Jaypee Associates</div>
                  <div style="font-size:20px; font-weight:700; margin-top:4px;">New Contact Submission</div>
                </td>
              </tr>
  
              <!-- Content -->
              <tr>
                <td style="padding:24px; color:${textColor}; font-family:-apple-system, Segoe UI, Roboto, Arial, sans-serif;">
                  <p style="margin:0 0 16px 0; font-size:15px; line-height:1.5;">
                    You’ve received a new message. Details are below.
                  </p>
  
                  <!-- Details table -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate; border-spacing:0 8px; font-size:14px;">
                    <tr>
                      <td style="width:140px; color:${labelColor}; padding:8px 0;">Name</td>
                      <td style="padding:8px 0; color:${textColor}; font-weight:600;">${name}</td>
                    </tr>
                    <tr>
                      <td style="width:140px; color:${labelColor}; padding:8px 0;">Email</td>
                      <td style="padding:8px 0;">
                        <a href="mailto:${email}" style="color:${brandColor}; text-decoration:none;">${email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:140px; color:${labelColor}; padding:8px 0;">Phone</td>
                      <td style="padding:8px 0;">
                        <a href="tel:${phone}" style="color:${brandColor}; text-decoration:none;">${phone}</a>
                      </td>
                    </tr>
                  </table>
  
                  <!-- Message box -->
                  <div style="margin-top:16px; padding:14px 16px; background:#f8fafc; border:1px solid ${borderColor}; border-radius:10px; color:${textColor}; font-size:14px; line-height:1.6; word-break:break-word;">
                    ${message}
                  </div>
  
                  <!-- CTA -->
                  <div style="margin-top:20px;">
                    <a href="mailto:${email}"
                      style="display:inline-block; background:${brandColor}; color:#ffffff; text-decoration:none; font-weight:600; font-size:14px; padding:12px 16px; border-radius:8px;">
                      Reply to ${name}
                    </a>
                  </div>
  
                  <!-- Divider -->
                  <div style="height:1px; background:${borderColor}; margin:24px 0;"></div>
  
                  <!-- Footer -->
                  <div style="font-size:12px; color:${labelColor};">
                    This email was sent automatically by your website.
                    If this wasn’t expected, please contact your administrator.
                  </div>
                </td>
              </tr>
  
              <!-- Brand footer bar -->
              <tr>
                <td style="background:#fafafa; border-top:1px solid ${borderColor}; padding:14px 24px; text-align:center; color:${labelColor}; font-size:12px; font-family:-apple-system, Segoe UI, Roboto, Arial, sans-serif;">
                  © ${new Date().getFullYear()} Jaypee Associates
                </td>
              </tr>
            </table>
  
            <!-- spacing under card -->
            <div style="line-height:24px; height:24px;">&#8202;</div>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
  }
  
  export function buildConnectUsAdminText(data: ConnectUsPayload) {
    return `New Contact Submission
  
  Name: ${data.name}
  Email: ${data.email}
  Phone: ${data.phone}
  
  Message:
  ${data.message}
  `;
  }