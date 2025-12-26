import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<User>,
  ) {


  }

  create(data: Partial<User>) {
    return this.model.create(data);
  }

  findById(id: string) {
    return this.model.findById(id).exec();
  }

  findByPhone(phone: string) {
    return this.model.findOne({ phone }).exec();
  }

  update(id: string, data: Partial<User>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  incrementPageView(id: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $inc: { pageViewCount: 1 } },
      { new: true },
    );
  }

  async search(search: string, page: number, limit: number) {
    const query: any = {};

    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.model
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.model.countDocuments(query),
    ]);

    return { users, total };
  }

  async findAllPaginated(page: number, limit: number, search?: string) {
    const query: any = {};

    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.model
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.model.countDocuments(query),
    ]);

    return { users, total };
  }

  async findVendorsByUserId(userId: string) {
    const user = await this.model
      .findById(userId)
      .populate('vendors')
      .exec();

    return user?.vendors ?? [];
  }

  async findNotificationsByUserId(userId: string) {
    const user = await this.model
      .findById(userId)
      .populate('notifications')
      .exec();

    return user?.notifications ?? [];
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}