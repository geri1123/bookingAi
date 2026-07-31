import { AnthropicToolDefinition } from "../infrastructure/http/anthropic.client";

// Dy "vegla" qe modeli mund t'i thrras. E njejta filozofi si ne core-service:
// check_availability eshte read-only (i sigurt te thirret shpesh), create_reservation
// ka efekt anesor real prandaj modeli udhezohet (ne system prompt) ta thrras VETEM
// pasi klienti ka konfirmuar shprehimisht detajet.
export const AI_TOOLS: AnthropicToolDefinition[] = [
  {
    name: "check_availability",
    description:
      "Kontrollon oraret e lira per nje sherbim/date te caktuar te ketij biznesi. Perdore para se t'i propozosh nje ore klientit.",
    input_schema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Data ne format YYYY-MM-DD" },
        serviceId: { type: "string", description: "ID e sherbimit, nese dihet" },
        employeeId: { type: "string", description: "ID e punonjesit te preferuar, nese dihet" },
      },
      required: ["date"],
    },
  },
  {
    name: "create_reservation",
    description:
      "Krijon rezervimin PERFUNDIMTAR ne sistem. Therrite VETEM pasi klienti ka konfirmuar shprehimisht emrin, sherbimin, dhe oren e rezervimit (p.sh. 'po, konfirmoj').",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        phone: { type: "string" },
        serviceId: { type: "string" },
        employeeId: { type: "string" },
        resourceId: { type: "string" },
        partySize: { type: "number" },
        startTime: { type: "string", description: "ISO 8601 datetime" },
        endTime: { type: "string", description: "ISO 8601 datetime, opsionale" },
      },
      required: ["name", "phone", "startTime"],
    },
  },
];
