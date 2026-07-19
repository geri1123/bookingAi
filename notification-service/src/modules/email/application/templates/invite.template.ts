export interface InvitationEmailTemplateData {
  inviterFirstName: string;
  businessName: string;
  role: string;
  acceptUrl: string;
}

export function buildInvitationEmailHtml(data: InvitationEmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Je ftuar!</h2>
          <p style="color: #444; line-height: 1.5;">
            <strong>${escapeHtml(data.inviterFirstName)}</strong> të ka ftuar të bashkohesh me
            <strong>${escapeHtml(data.businessName)}</strong> si <strong>${escapeHtml(data.role)}</strong>.
          </p>
          <a href="${data.acceptUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Prano Ftesën
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Kjo ftesë skadon pas 7 ditësh. Nëse s'e prisje këtë ftesë, thjesht injoroje.
          </p>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}