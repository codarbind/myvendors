import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { VendorsRepository } from './vendors.repository';
import { Vendor, VendorSchema } from './schemas/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vendor.name, schema: VendorSchema },
    ]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService, VendorsRepository],
  exports: [VendorsService]
})
export class VendorsModule { }
