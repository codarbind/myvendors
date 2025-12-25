import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Vendor } from '../../vendors/schemas/vendor.schema';
import { VendorInvite } from '../../invites/schemas/vendor-invite.schema';

export class AdminRepository {
  constructor(
    @InjectModel(User.name) private users: Model<User>,
    @InjectModel(Vendor.name) private vendors: Model<Vendor>,
    @InjectModel(VendorInvite.name) private invites: Model<VendorInvite>,
  ) {}

  async overviewStats() {
    const [
      totalUsers,
      totalVendors,
      visibleVendors,
      totalInvites,
      completedInvites,
      viewsAgg,
      sharesAgg,
    ] = await Promise.all([
      this.users.countDocuments(),
      this.vendors.countDocuments({ deleted: false }),
      this.vendors.countDocuments({ isVisible: true, deleted: false }),
      this.invites.countDocuments(),
      this.invites.countDocuments({ completed: true }),
      this.vendors.aggregate([{ $group: { _id: null, v: { $sum: '$viewCount' } } }]),
      this.vendors.aggregate([{ $group: { _id: null, s: { $sum: '$shareCount' } } }]),
    ]);

    return {
      totalUsers,
      totalVendors,
      visibleVendors,
      totalInvites,
      completedInvites,
      inviteCompletionRate:
        totalInvites === 0 ? 0 : completedInvites / totalInvites,
      totalViews: viewsAgg[0]?.v ?? 0,
      totalShares: sharesAgg[0]?.s ?? 0,
    };
  }

  usersPerDay(from: Date, to: Date) {
    return this.users.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  vendorsPerDay(from: Date, to: Date) {
    return this.vendors.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  inviteFunnel() {
    return Promise.all([
      this.invites.countDocuments(),
      this.invites.countDocuments({ verified: true }),
      this.invites.countDocuments({ completed: true }),
    ]).then(([sent, verified, completed]) => ({
      sent,
      verified,
      completed,
    }));
  }

  topVendors(by: 'views' | 'shares', limit: number) {
    const field = by === 'views' ? 'viewCount' : 'shareCount';
    return this.vendors
      .find({ deleted: false })
      .sort({ [field]: -1 })
      .limit(limit)
      .exec();
  }

  topUsers(limit: number) {
    return this.vendors.aggregate([
      { $group: { _id: '$addedBy', vendorCount: { $sum: 1 } } },
      { $sort: { vendorCount: -1 } },
      { $limit: limit },
    ]);
  }
}
