import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';


export class NotificationsRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly model: Model<Notification>,
  ) {}

  create(data: Partial<Notification>) {
    return this.model.create(data);
  }

  findByUser(userId: string) {
    return this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  markRead(notificationId: string) {
    return this.model.findByIdAndUpdate(notificationId, { read: true });
  }

  markAllRead(userId: string) {
    return this.model.updateMany(
      { userId, read: false },
      { read: true },
    );
  }

  adminList(filter: any, page: number, limit: number) {
    return Promise.all([
      this.model
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.model.countDocuments(filter),
    ]);
  }
}
