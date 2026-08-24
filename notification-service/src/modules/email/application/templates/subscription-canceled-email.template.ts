export interface SubscriptionCanceledEmailTemplateData {
  ownerFirstName: string;
  businessName: string;
  billingUrl: string;
}

export function buildSubscriptionCanceledEmailHtml(data: SubscriptionCanceledEmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Përshëndetje ${escapeHtml(data.ownerFirstName)},</h2>
          <p style="color: #444; line-height: 1.5;">
            Rinovimi automatik i abonimit për <strong>${escapeHtml(data.businessName)}</strong> ishte
            i çaktivizuar, dhe biznesi juaj tani ka kaluar në planin <strong>Falas</strong>.
            Disa funksionalitete (si asistenti AI) mund të jenë të kufizuara derisa të
            zgjidhni sërish një plan me pagesë.
          </p>
          <a href="${data.billingUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Shiko Planet
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
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}