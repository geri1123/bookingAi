import { Injectable, Logger, HttpStatus } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { AppConfigService } from "../../../../config/config.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../../users/domain/errors/user-error-codes.enum";

export interface GoogleUserInfo {
  googleId: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
}

@Injectable()
export class GoogleAuthClient {
  private readonly logger = new Logger(GoogleAuthClient.name);
  private readonly client: OAuth2Client;

  constructor(private readonly appConfig: AppConfigService) {
  
    this.client = new OAuth2Client(this.appConfig.googleClientId);
  }


  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    let payload;
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.appConfig.googleClientId,
      });
      payload = ticket.getPayload();
    } catch (err) {
      this.logger.warn(`Verifikimi i Google ID token deshtoi: ${(err as Error).message}`);
      throw new AppException(UserErrorCode.GOOGLE_TOKEN_INVALID, {}, HttpStatus.UNAUTHORIZED);
    }

    if (!payload?.sub || !payload.email) {
      throw new AppException(UserErrorCode.GOOGLE_TOKEN_INVALID, {}, HttpStatus.UNAUTHORIZED);
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified ?? false,
      firstName: payload.given_name ?? "",
      lastName: payload.family_name ?? "",
    };
  }
}