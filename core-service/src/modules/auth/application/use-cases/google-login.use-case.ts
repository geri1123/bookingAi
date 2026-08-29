import { HttpStatus, Injectable } from "@nestjs/common";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";
import { UserCreateRepository } from "../../../users/domain/repositories/user-create.repository";
import { UserUpdateRepository } from "../../../users/domain/repositories/user-update.repository";
import { UserEntity } from "../../../users/domain/entities/user.entity";
import { UserStatus } from "../../../users/domain/enums/user-status.enum";
import { GenerateUniqueUsernameService } from "../../../users/application/services/generate-unique-username.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../../users/domain/errors/user-error-codes.enum";
import { GoogleAuthClient } from "../../infrastructure/http/google-auth.client";
import { AuthenticateUserService, AuthenticateUserOutput } from "../services/authenticate-user.service";
import { EmailAlreadyExistsError } from "../../../users/domain/errors/email-already-exists.error";
import { UsernameAlreadyTakenError } from "../../../users/domain/errors/username-already-taken.error";

export interface GoogleLoginInput {
  idToken: string;
  rememberMe?: boolean;
}

export type GoogleLoginOutput = AuthenticateUserOutput;

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly googleAuthClient: GoogleAuthClient,
    private readonly userFindRepo: UserFindRepository,
    private readonly userCreateRepo: UserCreateRepository,
    private readonly userUpdateRepo: UserUpdateRepository,
    private readonly generateUsername: GenerateUniqueUsernameService,
    private readonly authenticateUser: AuthenticateUserService,
  ) {}

  async execute(input: GoogleLoginInput): Promise<GoogleLoginOutput> {
    const rememberMe = input.rememberMe ?? false;
    const google = await this.googleAuthClient.verifyIdToken(input.idToken);

    
    let user = await this.userFindRepo.findByGoogleId(google.googleId);

    if (!user) {
      // 2) S'kemi googleId te ruajtur, po email-i ekziston? Dy nen-raste:
      const existing = await this.userFindRepo.findByEmail(google.email.toLowerCase().trim());

      if (existing) {
     
        if (!google.emailVerified) {
          throw new AppException(UserErrorCode.GOOGLE_TOKEN_INVALID, {}, HttpStatus.UNAUTHORIZED);
        }

        const wasPendingVerification = existing.status === UserStatus.PENDING_VERIFICATION;
        existing.linkGoogleAccount(google.googleId);
        if (wasPendingVerification) {
       
          existing.verifyEmail();
        }

      
        await this.userUpdateRepo.update(existing.id, {
          googleId: existing.googleId!,
          authProvider: existing.authProvider,
          status: existing.status,
          emailVerifiedAt: existing.emailVerifiedAt,
        });

        user = existing;
      } else {
     
        const usernameSeed = google.email.split("@")[0] ?? "user";
        const username = await this.generateUsername.execute(usernameSeed);

        const newUser = UserEntity.createFromGoogle({
          username,
          firstName: google.firstName || "Google",
          lastName: google.lastName || "User",
          email: google.email,
          googleId: google.googleId,
        });

        try {
          user = await this.userCreateRepo.create(newUser);
        } catch (err) {
       
          if (err instanceof EmailAlreadyExistsError) {
            throw new AppException(UserErrorCode.EMAIL_ALREADY_IN_USE, { field: "email" }, HttpStatus.CONFLICT);
          }
          if (err instanceof UsernameAlreadyTakenError) {
            throw new AppException(UserErrorCode.USERNAME_ALREADY_TAKEN, { field: "username" }, HttpStatus.CONFLICT);
          }
          throw err;
        }
      }
    }

 
    if (user.status === UserStatus.SUSPENDED) {
      throw new AppException(UserErrorCode.ACCOUNT_SUSPENDED, {}, HttpStatus.FORBIDDEN);
    }
    if (user.status === UserStatus.DELETED) {
      throw new AppException(UserErrorCode.INVALID_CREDENTIALS, {}, HttpStatus.UNAUTHORIZED);
    }
  
    return this.authenticateUser.execute(user, rememberMe);
  }
}