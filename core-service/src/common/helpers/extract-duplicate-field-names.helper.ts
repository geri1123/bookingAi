// Forma REALE e "err.meta" me @prisma/adapter-pg eshte KREJT TJETER nga
// standardi Prisma - "target" (string[] ne top-level) S'EKZISTON FARE.
// Emri i fushes reale eshte "groposur" brenda:
//   err.meta.driverAdapterError.cause.constraint.fields  (array, p.sh. ["email"])
//
// I PERBASHKET per te gjithe repository-te qe kapin P2002 (business,
// service, resource, employee, user, etj.) - 1 vend i vetem, jo
// i perseritur ne çdo repository.
export function extractDuplicateFieldNames(meta: unknown): string[] {
  const m = meta as Record<string, unknown> | undefined;
  if (!m) return [];

  const standardTarget = m.target;
  if (Array.isArray(standardTarget)) return standardTarget.map(String);
  if (typeof standardTarget === "string") return [standardTarget];

  const driverError = m.driverAdapterError as Record<string, unknown> | undefined;
  const cause = driverError?.cause as Record<string, unknown> | undefined;
  const constraint = cause?.constraint as Record<string, unknown> | undefined;
  const fields = constraint?.fields;
  if (Array.isArray(fields)) return fields.map(String);

  return [];
}