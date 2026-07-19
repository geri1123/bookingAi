import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InvitationUpdateRepository } from "../../domain/repositories/invitation-update.repository";

@Injectable()
export class ExpireInvitationsTask {
  private readonly logger = new Logger(ExpireInvitationsTask.name);

  constructor(private readonly invitationUpdateRepo: InvitationUpdateRepository) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handle(): Promise<void> {
    const count = await this.invitationUpdateRepo.expireOverdue();

    if (count > 0) {
      this.logger.log(`Marked ${count} invitation(s) as EXPIRED`);
    }
  }
}