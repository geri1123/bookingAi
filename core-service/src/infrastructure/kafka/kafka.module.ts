import { Global, Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import { AppConfigModule } from '../../config/config.module';
import { KafkaTopicsInitializer } from './kafka-topics.initializer';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [KafkaProducerService, KafkaConsumerService , KafkaTopicsInitializer],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}