export interface BusinessCreatedEmailTemplateData {
  ownerFirstName: string;
  businessName: string;
  dashboardUrl: string;
}

export function buildBusinessCreatedEmailHtml(data: BusinessCreatedEmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Përshëndetje ${escapeHtml(data.ownerFirstName)},</h2>
          <p style="color: #444; line-height: 1.5;">
            Biznesi <strong>${escapeHtml(data.businessName)}</strong> u krijua me sukses!
            Tani mund të fillosh të konfigurosh shërbimet, orarin, dhe të lidhësh WhatsApp-in.
          </p>
          <a href="${data.dashboardUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Shko te Dashboard
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Nëse s'e ke krijuar ti këtë biznes, kontakto menjëherë suportin.
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