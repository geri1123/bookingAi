import { Injectable } from "@nestjs/common";
import { UserFindRepository } from "../../domain/repositories/user-find.repository";
import { VerificationTokenRepository } from "../../domain/repositories/verification-token.repository";
import { VerificationTokenEntity, TokenType } from "../../domain/entities/verification-token.entity";
import { TokenGenerator } from "../../domain/services/token-generator";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";
import { UserStatus } from "../../domain/enums/user-status.enum";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";

export interface ResendVerificationInput {
  email: string;
}

@Injectable()
export class ResendVerificationUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userFindRepo: UserFindRepository,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: ResendVerificationInput): Promise<void> {
    const user = await this.userFindRepo.findByEmail(input.email);

    if (!user) return;
    if (user.status !== UserStatus.PENDING_VERIFICATION) return;

    const rawToken = this.tokenGenerator.generate();
    const verificationToken = VerificationTokenEntity.create(user.id, rawToken, TokenType.EMAIL_VERIFICATION);

    await this.prisma.$transaction(async (tx) => {
      await this.tokenRepo.invalidateActiveTokens(user.id, TokenType.EMAIL_VERIFICATION, tx);
      await this.tokenRepo.create(verificationToken, tx);

      await this.outboxWriter.write(
        EventName.USER_EMAIL_VERIFICATION_REQUESTED,
        user.id,
        { userId: user.id, email: user.email, firstName: user.firstName, token: rawToken },
        tx,
      );
    });
  }
}