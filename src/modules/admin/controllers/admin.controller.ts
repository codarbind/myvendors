import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAnalyticsService } from '../services/admin-analytics.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { VendorListDto, VendorListResponseDto } from 'src/modules/vendors/dto/getAllVendors.dto';
import { VendorsService } from 'src/modules/vendors/vendors.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Admin')
@Controller('api/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly vendors: VendorsService, private readonly analytics: AdminAnalyticsService) { }

  @Get('vendors')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all vendors (paginated) Admin' })
  @ApiOkResponse({ type: VendorListResponseDto })
  async adminList(@Query() dto: VendorListDto) {
    return this.vendors.list({ ...dto, includeHidden: true });
  }


  @Get('stats/overview')
  overview() {
    return this.analytics.overview();
  }

  @Get('analytics/users-per-day')
  usersPerDay(@Query('from') from: string, @Query('to') to: string) {
    return this.analytics.usersPerDay(new Date(from), new Date(to));
  }

  @Get('analytics/vendors-per-day')
  vendorsPerDay(@Query('from') from: string, @Query('to') to: string) {
    return this.analytics.vendorsPerDay(new Date(from), new Date(to));
  }

  @Get('analytics/invite-funnel')
  inviteFunnel() {
    return this.analytics.inviteFunnel();
  }

  @Get('insights/top-vendors')
  topVendors(
    @Query('by') by: 'views' | 'shares' = 'views',
    @Query('limit') limit = 10,
  ) {
    return this.analytics.topVendors(by, Number(limit));
  }

  @Get('insights/top-users')
  topUsers(@Query('limit') limit = 10) {
    return this.analytics.topUsers(Number(limit));
  }
}
