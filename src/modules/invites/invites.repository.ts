import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VendorInvite } from './schemas/vendor-invite.schema';

export class InvitesRepository {
  constructor(
    @InjectModel(VendorInvite.name)
    private readonly model: Model<VendorInvite>,
  ) {}

  create(data: Partial<VendorInvite>) {
    return this.model.create(data);
  }

  findByToken(token: string) {
    return this.model.findOne({ token, deleted: false }).exec();
  }

  findByUser(userId: string) {
    return this.model
      .find({ invitedBy: userId, deleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async canReinvite(userId: string, vendorPhone: string) {
    const cooldownDate = new Date();
    cooldownDate.setDate(cooldownDate.getDate() - 10);

    const recent = await this.model.findOne({
      invitedBy: userId,
      vendorPhone,
      deleted: true,
      deletedAt: { $gte: cooldownDate },
    });

    return !recent;
  }

  markVerified(token: string, vendorName?: string) {
    return this.model.findOneAndUpdate(
      { token },
      { verified: true, vendorName },
      { new: true },
    );
  }

  markCompleted(token: string) {
    return this.model.findOneAndUpdate(
      { token },
      { completed: true, completedAt: new Date() },
      { new: true },
    );
  }

  softDelete(inviteId: string) {
    return this.model.findByIdAndUpdate(inviteId, {
      deleted: true,
      deletedAt: new Date(),
    });
  }
}
