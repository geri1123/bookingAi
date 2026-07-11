import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OutboxEventWriter } from '../../common/events/outbox-event-writer';
import { PrismaOutboxEventWriter } from '../persistence/outbox/prisma-outbox-event-writer';

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: OutboxEventWriter, useClass: PrismaOutboxEventWriter },
  ],
  exports: [PrismaService, OutboxEventWriter],
})
export class PrismaModule {}
