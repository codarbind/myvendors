import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './controllers/admin.controller';
import { AdminAnalyticsService } from './services/admin-analytics.service';
import { AdminRepository } from './repositories/admin.repository';

import { User, UserSchema } from '../users/schemas/user.schema';
import { Vendor, VendorSchema } from '../vendors/schemas/vendor.schema';
import { VendorInvite, VendorInviteSchema } from '../invites/schemas/vendor-invite.schema';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [
    VendorsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: VendorInvite.name, schema: VendorInviteSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminAnalyticsService, AdminRepository],
})
export class AdminModule {}
