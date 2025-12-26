import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './schemas/vendor.schema';

export class VendorsRepository {
  constructor(
    @InjectModel(Vendor.name)
    private readonly model: Model<Vendor>,
  ) { }

  create(data: Partial<Vendor>) {
    return this.model.create(data);
  }

  findById(id: string) {
    return this.model.findOne({ _id: id, deleted: false }).exec();
  }

  async findByWhatsapp(whatsapp: string) {
    const vendor = await this.model.find({ whatsapp, deleted: false })
      .populate({
        path: 'recommender',
        select: 'name phone',
      })
      .exec();

      return vendor
  }

  async paginate(
    page = 1,
    limit = 12,
    includeHidden = false,
  ) {
    const query: any = { deleted: false };
    if (!includeHidden) query.isVisible = true;

    const [vendors, total] = await Promise.all([
      this.model
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.model.countDocuments(query),
    ]);

    return { vendors, total };
  }

  incrementView(whatsapp: string) {
    return this.model.findOneAndUpdate(
      { whatsapp },
      { $inc: { viewCount: 1 } },
      { new: true },
    );
  }

  incrementShare(whatsapp: string) {
    return this.model.findOneAndUpdate(
      { whatsapp },
      { $inc: { shareCount: 1 } },
      { new: true },
    );
  }

  toggleVisibility(id: string, isVisible: boolean) {
    return this.model.findByIdAndUpdate(
      id,
      { isVisible },
      { new: true },
    );
  }

  softDelete(id: string) {
    return this.model.findByIdAndUpdate(id, {
      deleted: true,
      deletedAt: new Date(),
    });
  }
}
