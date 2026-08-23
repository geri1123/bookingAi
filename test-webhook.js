// Perdorim: node test-webhook.js
// Ndrysho vlerat me te dhenat e tua para se ta ekzekutosh.

const crypto = require("crypto");

const META_APP_SECRET = "*******";
const COMMUNICATION_SERVICE_URL = "http://localhost:8083/webhooks/whatsapp";

// Nderto nje payload te ngjashem me ate qe dergon Meta per mesazh WhatsApp
const payload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "ENTRY_ID",
      changes: [
        {
          field: "messages",
          value: {
            metadata: {
              // KETO duhet te perputhet me externalAccountId qe ke lidhur te core-service
              phone_number_id: "test-phone-id-1",
            },
            messages: [
              {
                // id: `wamid.TEST_${Date.now()}`,
                id: `wamid.TEST_FIXED_ID`,
                from: "355691234567", // numri i "klientit" qe simulon
                type: "text",
                text: { body: "Pershendetje, dua nje rezervim" },
              },
            ],
          },
        },
      ],
    },
  ],
};

const rawBody = JSON.stringify(payload);

const signature = crypto.createHmac("sha256", META_APP_SECRET).update(rawBody).digest("hex");

async function main() {
  const response = await fetch(COMMUNICATION_SERVICE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hub-Signature-256": `sha256=${signature}`,
    },
    body: rawBody,
  });

  console.log("Status:", response.status);
  console.log("Body:", await response.text());
}

main();