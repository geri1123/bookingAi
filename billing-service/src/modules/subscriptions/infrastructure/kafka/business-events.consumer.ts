import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { KafkaConsumerService } from "../../../../infrastructure/kafka/kafka-consumer.service";
import { ProvisionFreeSubscriptionService } from "../../application/services/provision-free-subscription.service";
import { getErrorMessage } from "../../../../common/utils/error.utils";

const TOPICS = {
  BUSINESS_CREATED: "business.created",
} as const;

interface BusinessCreatedPayload {
  businessId: string;
}

@Injectable()
export class BusinessEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(BusinessEventsConsumer.name);

  constructor(
    private readonly kafkaConsumer: KafkaConsumerService,
    private readonly provisionFreeSubscription: ProvisionFreeSubscriptionService,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.subscribe([TOPICS.BUSINESS_CREATED], async ({ topic, message }) => {
      if (!message.value) return;

      try {
        if (topic === TOPICS.BUSINESS_CREATED) {
          const payload = JSON.parse(message.value.toString()) as BusinessCreatedPayload;
          await this.provisionFreeSubscription.provision(payload.businessId);
        }
      } catch (err) {
        this.logger.error(`Failed to process message from ${topic}: ${getErrorMessage(err)}`);
      }
    });
  }
}
