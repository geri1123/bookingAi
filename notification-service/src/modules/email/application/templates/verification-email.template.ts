export interface VerificationEmailTemplateData {
  firstName: string;
  verifyUrl: string;
}

export function buildVerificationEmailHtml(data: VerificationEmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Përshëndetje ${escapeHtml(data.firstName)},</h2>
          <p style="color: #444; line-height: 1.5;">
            Faleminderit që u regjistrove. Kliko butonin më poshtë për të verifikuar email-in tënd.
          </p>
          <a href="${data.verifyUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Verifiko Email-in
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Nëse s'e kërkove këtë email, thjesht injoroje.
          </p>
        </div>
      </body>
    </html>
  `;
}

// Mbrojtje minimale kundër HTML injection nga fusha si firstName
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
