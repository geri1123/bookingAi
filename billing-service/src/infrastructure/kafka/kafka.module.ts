import { Global, Module } from "@nestjs/common";
import { KafkaConsumerService } from "./kafka-consumer.service";
import { KafkaProducerService } from "./kafka-producer.service";
import { AppConfigModule } from "../../config/config.module";

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [KafkaConsumerService, KafkaProducerService],
  exports: [KafkaConsumerService, KafkaProducerService],
})
export class KafkaModule {}
