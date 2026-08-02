const crypto = require("crypto");

// 1) Vendos ketu META_APP_SECRET-in tend real (nga "Show" tek App Secret)
const APP_SECRET = "5e8c84163c58479f304b06947fef53f2";

// 2) Ky duhet te jete SAKTESISHT i njejti qe perdore tek Postman kur lidhe WhatsApp
const PHONE_NUMBER_ID = "test-phone-id-1";

const body = JSON.stringify({
  object: "whatsapp_business_account",
  entry: [
    {
      id: "waba-test",
      changes: [
        {
          field: "messages",
          value: {
            metadata: { phone_number_id: PHONE_NUMBER_ID },
            messages: [
              {
                from: "355691234567",
                type: "text",
                text: { body: "Pershendetje, dua rezervim" },
              },
            ],
          },
        },
      ],
    },
  ],
});

const signature =
  "sha256=" + crypto.createHmac("sha256", APP_SECRET).update(body).digest("hex");

fetch("http://localhost:8080/webhooks/whatsapp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-hub-signature-256": signature,
  },
  body,
})
  .then(async (r) => {
    console.log("Status:", r.status);
    console.log("Response:", await r.text());
  })
  .catch((err) => console.error("Gabim:", err.message));