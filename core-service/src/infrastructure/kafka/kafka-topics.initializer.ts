import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { AppConfigService } from "../../config/config.service";

const REQUIRED_TOPICS = [
  "user.email-verification.requested",
  "user.welcome-email.requested",
  "user.created",
  "user.updated",
  "business.created",
  "business.activated",
  "business.setup-reminder",
  "service.created",
  "employee.created",
  "schedule.created",
  "invitation.sent",
  "invitation.accepted",
];

@Injectable()
export class KafkaTopicsInitializer implements OnModuleInit {
  private readonly logger = new Logger(KafkaTopicsInitializer.name);

  constructor(private readonly appConfig: AppConfigService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: `${this.appConfig.serviceName}-admin`,
      brokers: [this.appConfig.kafkaBroker],
    });

    const admin = kafka.admin();
    await admin.connect();

    try {
      const existingTopics = await admin.listTopics();
      const missingTopics = REQUIRED_TOPICS.filter((t) => !existingTopics.includes(t));

      if (missingTopics.length > 0) {
        await admin.createTopics({
          topics: missingTopics.map((topic) => ({ topic, numPartitions: 1, replicationFactor: 1 })),
        });
        this.logger.log(`Created missing Kafka topics: ${missingTopics.join(", ")}`);
      } else {
        this.logger.log("All required Kafka topics already exist.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to initialize Kafka topics: ${message}`);
    } finally {
      await admin.disconnect();
    }
  }
}