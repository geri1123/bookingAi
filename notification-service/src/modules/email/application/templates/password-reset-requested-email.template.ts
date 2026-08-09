export interface PasswordResetRequestedEmailTemplateData {
  firstName: string;
  resetUrl: string;
}

export function buildPasswordResetRequestedEmailHtml(data: PasswordResetRequestedEmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Përshëndetje ${escapeHtml(data.firstName)},</h2>
          <p style="color: #444; line-height: 1.5;">
            Kemi marrë një kërkesë për të rivendosur fjalëkalimin e llogarisë tuaj. Nëse e ke bërë ti këtë
            kërkesë, kliko butonin më poshtë për të vendosur fjalëkalim të ri.
          </p>
          <a href="${data.resetUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Rivendos Fjalëkalimin
          </a>
          <p style="color: #444; line-height: 1.5; margin-top: 24px;">
            Ky link skadon pas 30 minutash. Nëse s'e ke bërë ti këtë kërkesë, thjesht injoro këtë email —
            fjalëkalimi juaj mbetet i pandryshuar.
          </p>
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