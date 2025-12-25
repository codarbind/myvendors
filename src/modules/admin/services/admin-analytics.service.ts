import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly repo: AdminRepository) {}

  overview() {
    return this.repo.overviewStats();
  }

  usersPerDay(from: Date, to: Date) {
    return this.repo.usersPerDay(from, to);
  }

  vendorsPerDay(from: Date, to: Date) {
    return this.repo.vendorsPerDay(from, to);
  }

  inviteFunnel() {
    return this.repo.inviteFunnel();
  }

  topVendors(by: 'views' | 'shares', limit: number) {
    return this.repo.topVendors(by, limit);
  }

  topUsers(limit: number) {
    return this.repo.topUsers(limit);
  }
}
