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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

@ApiTags('Vendors')
@Controller('api/vendors')
export class VendorsController {
  constructor(private readonly vendors: VendorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vendors (paginated)' })
  list(
    @Query('page') page = 1,
    @Query('limit') limit = 12,
    @Query('includeHidden') includeHidden = 'false',
  ) {
    return this.vendors.list(
      Number(page),
      Number(limit),
      includeHidden === 'true',
    );
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
    return this.vendors.create(dto);
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
