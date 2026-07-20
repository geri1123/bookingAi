export interface InvitationAcceptedEmailTemplateData {
  inviterFirstName: string;
  newMemberFirstName: string;
  newMemberEmail: string;
  businessName: string;
  role: string;
  businessUrl: string;
}

export function buildInvitationAcceptedEmailHtml(data: InvitationAcceptedEmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Ftesa u pranua!</h2>
          <p style="color: #444; line-height: 1.5;">
            Përshëndetje <strong>${escapeHtml(data.inviterFirstName)}</strong>,
          </p>
          <p style="color: #444; line-height: 1.5;">
            <strong>${escapeHtml(data.newMemberFirstName)}</strong>
            (${escapeHtml(data.newMemberEmail)}) pranoi ftesën tënde dhe tani është
            <strong>${escapeHtml(data.role)}</strong> te <strong>${escapeHtml(data.businessName)}</strong>.
          </p>
          <a href="${data.businessUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Shiko Ekipin
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Ky është një njoftim automatik nga ${escapeHtml(data.businessName)}.
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