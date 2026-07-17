import { BusinessMemberRole } from "../../../business/domain/entities/business-member.entity";

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  sub: string;       
  businessId?: string; 
  rememberMe: boolean;
  type: "refresh";    
}
export abstract class TokenService {
  abstract issueFullToken(payload: {
    userId: string;
    businessId: string;
    role: BusinessMemberRole;
    rememberMe: boolean;
  }): Promise<IssuedTokens>;

  abstract issuePreAuthToken(userId: string, rememberMe: boolean): Promise<IssuedTokens>;

  abstract verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPayload>;
}