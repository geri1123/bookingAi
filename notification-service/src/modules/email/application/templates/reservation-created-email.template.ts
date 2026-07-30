export interface ReservationCreatedEmailTemplateData {
  businessName: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  startTime: string;
}

export function buildReservationCreatedEmailHtml(data: ReservationCreatedEmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #111;">📅 Rezervim i ri!</h2>
          <p style="color: #444; line-height: 1.5;">
            <strong>${escapeHtml(data.customerName)}</strong> (${escapeHtml(data.customerPhone)})
            ka rezervuar <strong>${escapeHtml(data.serviceName)}</strong> për
            <strong>${escapeHtml(data.startTime)}</strong>.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Ky njoftim u dërgua automatikisht nga ${escapeHtml(data.businessName)} — sistemi i rezervimeve.
          </p>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}