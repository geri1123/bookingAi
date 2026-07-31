import { AnthropicToolDefinition } from "../infrastructure/http/anthropic.client";


const CREATE_RESERVATION_TOOL: AnthropicToolDefinition = {
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
};

const CHECK_AVAILABILITY_TOOL: AnthropicToolDefinition = {
  name: "check_availability",
  description:
    "Kontrollon oraret e lira te nje PUNONJESI per nje sherbim/date te caktuar. Perdore para se t'i propozosh nje ore klientit.",
  input_schema: {
    type: "object",
    properties: {
      date: { type: "string", description: "Data ne format YYYY-MM-DD" },
      serviceId: { type: "string", description: "ID e sherbimit, nese dihet" },
      employeeId: { type: "string", description: "ID e punonjesit te preferuar, nese dihet" },
    },
    required: ["date"],
  },
};

const CHECK_RESOURCE_AVAILABILITY_TOOL: AnthropicToolDefinition = {
  name: "check_resource_availability",
  description:
    "Kontrollon TAVOLINAT/DHOMAT e lira per nje interval kohor dhe numer personash (partySize) te caktuar. Perdore para se t'i propozosh nje ore klientit.",
  input_schema: {
    type: "object",
    properties: {
      startTime: { type: "string", description: "ISO 8601 datetime" },
      endTime: { type: "string", description: "ISO 8601 datetime" },
      partySize: { type: "number", description: "Sa persona/dhome nevojiten" },
    },
    required: ["startTime", "endTime"],
  },
};

// Zgjedhja e grupit te tools BEHET PARAPRAKISHT, sipas ACTIVATION_REQUIREMENTS

export function resolveToolsForBusiness(params: { needsEmployee: boolean; needsResource: boolean }): AnthropicToolDefinition[] {
  if (params.needsEmployee) {
    return [CHECK_AVAILABILITY_TOOL, CREATE_RESERVATION_TOOL];
  }
  if (params.needsResource) {
    return [CHECK_RESOURCE_AVAILABILITY_TOOL, CREATE_RESERVATION_TOOL];
  }

  return [CREATE_RESERVATION_TOOL];
}