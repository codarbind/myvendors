// src/message/message.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageService } from './message.service';
import { ThirdPartyService } from './thirdparty.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [MessageService, ThirdPartyService],
  exports: [MessageService],
})
export class MessageModule {}