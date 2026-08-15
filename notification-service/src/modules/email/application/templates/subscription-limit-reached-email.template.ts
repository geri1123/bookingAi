export interface SubscriptionLimitReachedEmailTemplateData {
  ownerFirstName: string;
  businessName: string;
  messageCount: number;
  messageLimit: number | null;
  billingUrl: string;
}

export function buildSubscriptionLimitReachedEmailHtml(data: SubscriptionLimitReachedEmailTemplateData): string {
  const limitText = data.messageLimit !== null ? `${data.messageCount}/${data.messageLimit}` : `${data.messageCount}`;

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Përshëndetje ${escapeHtml(data.ownerFirstName)},</h2>
          <p style="color: #444; line-height: 1.5;">
            Biznesi <strong>${escapeHtml(data.businessName)}</strong> ka arritur limitin mujor të
            mesazheve AI (<strong>${limitText}</strong>). Nga tani, asistenti AI nuk do t'u përgjigjet
            më klientëve derisa të rinovoni ose ndryshoni planin.
          </p>
          <a href="${data.billingUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Menaxho Planin
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Ky është një njoftim automatik nga sistemi.
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