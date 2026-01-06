import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { SearchVendorDto } from './dto/search-vendor.dto';
import { VendorListDto, VendorListResponseDto } from './dto/getAllVendors.dto';
import { MessageService } from '../messagings/message.service';
import { removePlus } from 'src/common/utils/formatter';

@ApiTags('Vendors')
@Controller('api/vendors')
export class VendorsController {
  constructor(private readonly vendors: VendorsService, private readonly messagingService: MessageService) { }

  @Get()
  @ApiOperation({ summary: 'Get all vendors (paginated)' })
  @ApiOkResponse({ type: VendorListResponseDto })
  async list(@Query() dto: VendorListDto) {
    return this.vendors.list(dto);
  }



  @Get('search')
  search(@Query() queries: SearchVendorDto) {
    return this.vendors.search(queries);
  }

  @Get(':vendorId')
  get(@Param('vendorId') vendorId: string) {
    return this.vendors.getById(vendorId);
  }



  @Get('whatsapp/:whatsapp')
  getByWhatsapp(@Param('whatsapp') whatsapp: string) {
    return this.vendors.getByWhatsapp(whatsapp);
  }

  @Post()
  @ApiOperation({ summary: 'Add vendor' })
  create(@Body() dto: CreateVendorDto) {
    
    const createdVendor = this.vendors.create(dto);
    const phoneNumber = removePlus(dto.whatsapp)
    const vendor = { name: dto.name, specialty: dto.specialty, whatsapp: dto.whatsapp }
    const user = { name: '' }
    const vendorUrl = `https://myVendors.name.ng/share/${vendor.whatsapp}`;
    const text = `Hi ${vendor.name}!\n\n${user.name || 'Someone'} just listed you on myVendors.name.ng as a trusted ${vendor.specialty}.\n\nYour profile: ${vendorUrl}\n\nNow their friends and family can easily find and patronise you!`

    this.messagingService.sendFromInternalService(text, phoneNumber)

    return createdVendor
  }

  @Post('whatsapp/:whatsapp/view')
  incrementView(@Param('whatsapp') whatsapp: string) {
    return this.vendors.incrementView(whatsapp);
  }

  @Post('whatsapp/:whatsapp/share')
  incrementShare(@Param('whatsapp') whatsapp: string) {
    return this.vendors.incrementShare(whatsapp);
  }

  @Patch(':vendorId/visibility')
  toggleVisibility(
    @Param('vendorId') vendorId: string,
    @Body('isVisible') isVisible: boolean,
  ) {
    return this.vendors.toggleVisibility(vendorId, isVisible);
  }

  @Delete(':vendorId')
  delete(@Param('vendorId') vendorId: string) {
    return this.vendors.delete(vendorId);
  }
}
