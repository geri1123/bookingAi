import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

// Guard global - verifikon vetem signature + expiry te JWT.
// Nuk ben asnje query ne DB. Regjistrohet si APP_GUARD ne
// app.module.ts te CDO mikroshërbimi.
// Pranon tokenin nga cookie (web) ose Authorization header (mobile) -
// logjika e nxjerrjes eshte te JwtStrategy, guard-i vetem verifikon.
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}