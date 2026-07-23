import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { BusinessFindRepository } from "../../business/domain/repositories/business-find.repository";
import { OutboxEventWriter } from "../../../common/events/outbox-event-writer";
import { EventName } from "../../../common/events/event-name.enum";

const REMINDER_AFTER_DAYS = 3;
// const REMINDER_AFTER_DAYS=1;

const PAGE_SIZE = 200;
const MAX_TOTAL_PER_RUN = 20_000;


@Injectable()
export class BusinessSetupReminderService {
  private readonly logger = new Logger(BusinessSetupReminderService.name);

  constructor(
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_9AM)
   @Cron(CronExpression.EVERY_10_SECONDS)
  async remindIncompleteBusinesses(): Promise<void> {
    // const cutoff = new Date(Date.now() - REMINDER_AFTER_DAYS * 24 * 60 * 60 * 1000);
const cutoff = new Date(Date.now() - 10 * 1000); 
    let cursorId: string | undefined = undefined;
    let totalDispatched = 0;

    while (totalDispatched < MAX_TOTAL_PER_RUN) {
      const page = await this.businessFindRepo.findStalePendingSetupPage(cutoff, PAGE_SIZE, cursorId);

      if (page.length === 0) break;

      for (const business of page) {
        try {
          await this.outboxWriter.write(EventName.BUSINESS_SETUP_REMINDER_CHECK, business.id, {
            businessId: business.id,
          });
          totalDispatched++;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(`Failed to dispatch reminder-check for business ${business.id}: ${message}`);
        }
      }

      cursorId = page[page.length - 1].id;
      if (page.length < PAGE_SIZE) break;
    }

    if (totalDispatched >= MAX_TOTAL_PER_RUN) {
      this.logger.warn(`Hit MAX_TOTAL_PER_RUN=${MAX_TOTAL_PER_RUN} — mund te kete edhe te tjere, neserm.`);
    }

    if (totalDispatched > 0) {
      this.logger.log(`Dispatched ${totalDispatched} business-setup-reminder-check events.`);
    }
  }
}