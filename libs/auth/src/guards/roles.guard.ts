import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { BusinessMemberRole, JwtPayload } from "../types/jwt-payload.type";

// Lexon vetem req.user.role, qe vjen nga payload i JWT-se (jo DB).
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      BusinessMemberRole[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const user: JwtPayload = context.switchToHttp().getRequest().user;
    return !!user?.role && requiredRoles.includes(user.role);
  }
}
