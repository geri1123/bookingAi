import { Global, Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';
import { AppConfigModule } from '../../config/config.module';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [ KafkaConsumerService],
  exports: [ KafkaConsumerService],
})
export class KafkaModule {}