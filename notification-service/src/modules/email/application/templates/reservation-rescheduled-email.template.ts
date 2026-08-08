export interface ReservationRescheduledEmailTemplateData {
  businessName: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  previousStartTime: string;
  previousEndTime?: string;
  startTime: string;
  endTime?: string;
}

export function buildReservationRescheduledEmailHtml(data: ReservationRescheduledEmailTemplateData): string {
  const oldPeriodText = data.previousEndTime
    ? `nga <strong>${escapeHtml(data.previousStartTime)}</strong> deri <strong>${escapeHtml(data.previousEndTime)}</strong>`
    : `<strong>${escapeHtml(data.previousStartTime)}</strong>`;

  const newPeriodText = data.endTime
    ? `nga <strong>${escapeHtml(data.startTime)}</strong> deri <strong>${escapeHtml(data.endTime)}</strong>`
    : `<strong>${escapeHtml(data.startTime)}</strong>`;

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background: #f4f4f5; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #b45309;">🔄 Rezervim i ndryshuar</h2>
          <p style="color: #444; line-height: 1.5;">
            <strong>${escapeHtml(data.customerName)}</strong> (${escapeHtml(data.customerPhone)})
            ka ndryshuar oren e rezervimit per <strong>${escapeHtml(data.serviceName)}</strong>.
          </p>
          <p style="color: #444; line-height: 1.5;">
            Nga: ${oldPeriodText}<br/>
            Ne: ${newPeriodText}
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
