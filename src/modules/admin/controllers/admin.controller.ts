import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAnalyticsService } from '../services/admin-analytics.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('Admin')
@Controller('api/admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly analytics: AdminAnalyticsService) {}

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
