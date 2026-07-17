import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";

// Importohet ne app.module.ts te cdo mikroshërbimi qe ka nevoje
// te verifikoje JWT (pothuajse te gjitha 6 shërbimet).
@Module({
  imports: [PassportModule],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthLibModule {}
