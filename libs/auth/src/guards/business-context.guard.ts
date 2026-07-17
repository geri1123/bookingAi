import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtPayload } from "../types/jwt-payload.type";

// Refuzon nese tokeni eshte akoma "pre-auth" (useri s'ka zgjedhur
// ende biznesin). Perdoret ne endpoint-et e dashboard-it.
@Injectable()
export class BusinessContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user: JwtPayload = req.user;

    if (!user?.businessId) {
      throw new ForbiddenException("Duhet te zgjidhni nje biznes fillimisht");
    }
    return true;
  }
}
