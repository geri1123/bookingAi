export interface SubscriptionCreatedEmailTemplateData {
  ownerFirstName: string;
  businessName: string;
  planName: string;
  messageLimit: number | null;
  dashboardUrl: string;
}

export function buildSubscriptionCreatedEmailHtml(data: SubscriptionCreatedEmailTemplateData): string {
  const limitText =
    data.messageLimit === null
      ? "mesazhe pa limit"
      : `deri ${data.messageLimit} mesazhe/muaj`;

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Përshëndetje ${escapeHtml(data.ownerFirstName)},</h2>
          <p style="color: #444; line-height: 1.5;">
            Faleminderit! Abonimi <strong>${escapeHtml(data.planName)}</strong> i biznesit
            <strong>${escapeHtml(data.businessName)}</strong> tani është aktiv — mund të përdorni
            ${escapeHtml(limitText)} me asistentin AI.
          </p>
          <a href="${data.dashboardUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Shko te Dashboard
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Faturën/pagesën do e merrni veçmas nga Paddle. Ky është njoftimi ynë i mirëseardhjes.
          </p>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}