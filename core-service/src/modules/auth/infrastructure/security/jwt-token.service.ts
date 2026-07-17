import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { AppConfigService } from "../../../../config/config.service";
import { BusinessMemberRole } from "../../../business/domain/entities/business-member.entity";
import { IssuedTokens, RefreshTokenPayload, TokenService } from "../../domain/services/token.service";

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  private expiresIn(value: string): JwtSignOptions["expiresIn"] {
    return value as JwtSignOptions["expiresIn"];
  }

  private refreshTtl(rememberMe: boolean): string {
    return rememberMe
      ? this.configService.jwtRefreshTtlRememberMe
      : this.configService.jwtRefreshTtlDefault;
  }

  async issueFullToken(payload: {
    userId: string;
    businessId: string;
    role: BusinessMemberRole;
    rememberMe: boolean;
  }): Promise<IssuedTokens> {
    const accessToken = await this.jwtService.signAsync(
      { sub: payload.userId, businessId: payload.businessId, role: payload.role, type: "full" },
      { secret: this.configService.jwtAccessSecret, expiresIn: this.expiresIn(this.configService.jwtAccessTtl) },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: payload.userId, businessId: payload.businessId, rememberMe: payload.rememberMe, type: "refresh" },
      { secret: this.configService.jwtRefreshSecret, expiresIn: this.expiresIn(this.refreshTtl(payload.rememberMe)) },
    );

    return { accessToken, refreshToken };
  }

  async issuePreAuthToken(userId: string, rememberMe: boolean): Promise<IssuedTokens> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, type: "pre-auth", rememberMe },
      { secret: this.configService.jwtAccessSecret, expiresIn: this.expiresIn("5m") },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, rememberMe, type: "refresh" },
      { secret: this.configService.jwtRefreshSecret, expiresIn: this.expiresIn(this.refreshTtl(rememberMe)) },
    );

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.jwtRefreshSecret,
      });
      if (payload.type !== "refresh") {
        throw new UnauthorizedException();
      }
      return payload;
    } catch {
      throw new UnauthorizedException("Refresh token i pavlefshem ose i skaduar");
    }
  }
}