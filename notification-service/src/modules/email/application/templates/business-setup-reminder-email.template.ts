// mail/templates/business-setup-reminder-email.template.ts

export interface BusinessSetupReminderEmailTemplateData {
  ownerFirstName: string;
  businessName: string;
  missingStepsLabels: string[];
  dashboardUrl: string;
}

export function buildBusinessSetupReminderEmailHtml(data: BusinessSetupReminderEmailTemplateData): string {
  const stepsListHtml = data.missingStepsLabels
    .map((label) => `<li style="margin-bottom: 6px;">${escapeHtml(label)}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Ende pak hapa deri sa të fillosh</h2>
          <p style="color: #444; line-height: 1.5;">
            Përshëndetje <strong>${escapeHtml(data.ownerFirstName)}</strong>,
          </p>
          <p style="color: #444; line-height: 1.5;">
            Biznesi <strong>${escapeHtml(data.businessName)}</strong> ende s'është aktiv. Të mungon:
          </p>
          <ul style="color: #444; line-height: 1.5; padding-left: 20px;">
            ${stepsListHtml}
          </ul>
          <a href="${data.dashboardUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Përfundo Konfigurimin
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Ky është një njoftim automatik. Nëse ke pyetje, na kontakto.
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