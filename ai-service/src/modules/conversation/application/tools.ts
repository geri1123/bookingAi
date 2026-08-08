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
    "Kontrollon oraret e lira te nje PUNONJESI per nje sherbim/date te caktuar. Perdore para se t'i propozosh nje ore klientit per nje REZERVIM TE RI. MOS e perdor per te kontrolluar oren e re gjate nje NDRYSHIMI te rezervimit ekzistues (perdor 'reschedule_reservation' direkt per ate rast, ai e ben vete kontrollin sakte).",
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
    "Kontrollon TAVOLINAT/DHOMAT e lira per nje interval kohor dhe numer personash (partySize) te caktuar. Perdore para se t'i propozosh nje ore klientit per nje REZERVIM TE RI. MOS e perdor per te kontrolluar oren e re gjate nje NDRYSHIMI te rezervimit ekzistues — rezervimi EKZISTUES i klientit do te dukej gabimisht si 'zene' ne kete kontroll (perdor 'reschedule_reservation' direkt per ate rast, ai e perjashton vete rezervimin qe po ndryshohet).",
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

const FIND_CUSTOMER_RESERVATIONS_TOOL: AnthropicToolDefinition = {
  name: "find_customer_reservations",
  description:
    "Gjen rezervimet AKTIVE (jo te anulluara, ne te ardhmen) te klientit qe po shkruan, sipas numrit te tij te telefonit. Perdore GJITHMONE PARA se te thersh 'reschedule_reservation' ose 'cancel_reservation', per te gjetur ID-ne e sakte te rezervimit dhe per t'ia konfirmuar klientit se cilin rezervim ka fjala (nese ka me shume se 1).",
  input_schema: {
    type: "object",
    properties: {
      phone: { type: "string", description: "Numri i telefonit te klientit" },
    },
    required: ["phone"],
  },
};

const RESCHEDULE_RESERVATION_TOOL: AnthropicToolDefinition = {
  name: "reschedule_reservation",
  description:
    "Ndryshon oren e nje rezervimi EKZISTUES. Therrite VETEM pasi ke gjetur ID-ne e sakte te rezervimit me 'find_customer_reservations' DHE klienti ka konfirmuar shprehimisht oren e re (p.sh. 'po, konfirmoj'). Ky tool e kontrollon VETE disponueshmerine e ores se re (duke PERJASHTUAR rezervimin ekzistues te ketij klienti nga kontrolli) — MOS perdor 'check_availability'/'check_resource_availability' PARA ketij tool per te njejtin qellim, sepse ato do ta trajtonin gabimisht rezervimin AKTUAL te klientit si 'zene'.",
  input_schema: {
    type: "object",
    properties: {
      reservationId: { type: "string", description: "ID e rezervimit qe do te ndryshohet (nga find_customer_reservations)" },
      phone: { type: "string", description: "Numri i telefonit te klientit, per verifikim" },
      startTime: { type: "string", description: "Ora e re, ISO 8601 datetime" },
      endTime: { type: "string", description: "Ora e re e mbarimit, ISO 8601, opsionale" },
    },
    required: ["reservationId", "phone", "startTime"],
  },
};

const CANCEL_RESERVATION_TOOL: AnthropicToolDefinition = {
  name: "cancel_reservation",
  description:
    "Anullon nje rezervim EKZISTUES. Therrite VETEM pasi ke gjetur ID-ne e sakte te rezervimit me 'find_customer_reservations' DHE klienti ka konfirmuar shprehimisht qe do te anulloje (p.sh. 'po, anulloje').",
  input_schema: {
    type: "object",
    properties: {
      reservationId: { type: "string", description: "ID e rezervimit qe do te anullohet (nga find_customer_reservations)" },
      phone: { type: "string", description: "Numri i telefonit te klientit, per verifikim" },
    },
    required: ["reservationId", "phone"],
  },
};



export function resolveToolsForBusiness(params: { needsEmployee: boolean; needsResource: boolean }): AnthropicToolDefinition[] {
  
  const managementTools = [FIND_CUSTOMER_RESERVATIONS_TOOL, RESCHEDULE_RESERVATION_TOOL, CANCEL_RESERVATION_TOOL];

  if (params.needsEmployee) {
    return [CHECK_AVAILABILITY_TOOL, CREATE_RESERVATION_TOOL, ...managementTools];
  }
  if (params.needsResource) {
    return [CHECK_RESOURCE_AVAILABILITY_TOOL, CREATE_RESERVATION_TOOL, ...managementTools];
  }

  return [CREATE_RESERVATION_TOOL, ...managementTools];
}