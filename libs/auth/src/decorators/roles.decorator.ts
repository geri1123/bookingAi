import { SetMetadata } from "@nestjs/common";
import { BusinessMemberRole } from "../types/jwt-payload.type";

export const ROLES_KEY = "roles";

export const Roles = (...roles: BusinessMemberRole[]) =>
  SetMetadata(ROLES_KEY, roles);
