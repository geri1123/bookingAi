export interface WelcomeEmailTemplateData {
  firstName: string;
  loginUrl: string;
}

export function buildWelcomeEmailHtml(data: WelcomeEmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">Mirë se erdhe, ${escapeHtml(data.firstName)}! 🎉</h2>
          <p style="color: #444; line-height: 1.5;">
            Email-i yt u verifikua me sukses dhe llogaria jote tani është aktive.
            Je gati të fillosh të përdorësh platformën.
          </p>
          <a href="${data.loginUrl}"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Hyr në llogari
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Nëse ke pyetje, thjesht na kontakto — jemi këtu për të ndihmuar.
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