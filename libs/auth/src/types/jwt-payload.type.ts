export type BusinessMemberRole = "OWNER" | "MANAGER" | "STAFF";

export interface JwtPayload {
  sub: string;
  businessId?: string;
  role?: BusinessMemberRole;
  type: "pre-auth" | "full";
  rememberMe?: boolean;
}