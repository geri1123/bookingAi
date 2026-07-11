import { Global, Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import { AppConfigModule } from '../../config/config.module';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}