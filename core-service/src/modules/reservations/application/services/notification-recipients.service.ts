import { Injectable } from "@nestjs/common";
import { BusinessMemberFindRepository } from "../../../business/domain/repositories/business-member-find.repository";
import { BusinessMemberRole } from "../../../business/domain/entities/business-member.entity";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";


@Injectable()
export class NotificationRecipientsService {
  constructor(
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly userFindRepo: UserFindRepository,
  ) {}

  async resolveNotificationEmails(businessId: string): Promise<string[]> {
    const members = await this.businessMemberFindRepo.findByBusinessAndRoles(businessId, [
      BusinessMemberRole.OWNER,
      BusinessMemberRole.MANAGER,
    ]);

    const emails = await Promise.all(
      members.map(async (member) => {
        const user = await this.userFindRepo.findById(member.userId);
        return user?.email ?? null;
      }),
    );

    return emails.filter((e): e is string => !!e);
  }
}
