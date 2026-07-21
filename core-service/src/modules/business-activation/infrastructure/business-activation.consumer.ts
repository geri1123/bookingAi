import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { KafkaConsumerService } from "../../../infrastructure/kafka/kafka-consumer.service";
import { EventName } from "../../../common/events/event-name.enum";
import { BusinessActivationChecker } from "../application/business-activation-checker.service";

interface ActivationTriggerPayload {
  businessId: string;
}

@Injectable()
export class BusinessActivationConsumer implements OnModuleInit {
  private readonly logger = new Logger(BusinessActivationConsumer.name);

  constructor(
    private readonly kafkaConsumer: KafkaConsumerService,
    private readonly activationChecker: BusinessActivationChecker,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.subscribe(
      [EventName.SERVICE_CREATED, EventName.EMPLOYEE_CREATED, EventName.SCHEDULE_CREATED],
      async ({ message }) => {
        if (!message.value) return;

        try {
          const payload = JSON.parse(message.value.toString()) as ActivationTriggerPayload;
          await this.activationChecker.checkAndActivate(payload.businessId);
        } catch (err) {
          const errMessage = err instanceof Error ? err.message : String(err);
          this.logger.error(`Failed to process activation trigger: ${errMessage}`);
        }
      },
    );
  }
}
