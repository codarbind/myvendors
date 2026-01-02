import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { InvitesRepository } from './invites.repository';
import {
  VendorInvite,
  VendorInviteSchema,
} from './schemas/vendor-invite.schema';
import { MessageModule } from '../messagings/messagings.module';

@Module({
  imports: [
    MessageModule,
    MongooseModule.forFeature([
      { name: VendorInvite.name, schema: VendorInviteSchema },
    ]),
  ],
  controllers: [InvitesController],
  providers: [InvitesService, InvitesRepository],
})
export class InvitesModule {}
