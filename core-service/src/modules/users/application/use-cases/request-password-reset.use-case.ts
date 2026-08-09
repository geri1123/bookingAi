import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { UserFindRepository } from "../../domain/repositories/user-find.repository";
import { VerificationTokenRepository } from "../../domain/repositories/verification-token.repository";
import { VerificationTokenEntity, TokenType } from "../../domain/entities/verification-token.entity";
import { TokenGenerator } from "../../domain/services/token-generator";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

export interface RequestPasswordResetInput {
  email: string;
}

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userFindRepo: UserFindRepository,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: RequestPasswordResetInput): Promise<void> {
    const user = await this.userFindRepo.findByEmail(input.email);

  
    if (!user) return;

    const rawToken = this.tokenGenerator.generate();
    const resetToken = VerificationTokenEntity.create(user.id, rawToken, TokenType.PASSWORD_RESET);

    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Password reset token per ${user.email}: ${rawToken}`);
    }

    await this.prisma.$transaction(async (tx) => {
   
      await this.tokenRepo.invalidateActiveTokens(user.id, TokenType.PASSWORD_RESET, tx);
      await this.tokenRepo.create(resetToken, tx);

      await this.outboxWriter.write(
        EventName.USER_PASSWORD_RESET_REQUESTED,
        user.id,
        { userId: user.id, email: user.email, firstName: user.firstName, token: rawToken },
        tx,
      );
    });
  }
}