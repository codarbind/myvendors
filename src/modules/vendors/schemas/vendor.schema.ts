import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Vendor extends Document {
  @Prop({ index: true })
  name: string;

  @Prop({ index: true })
  specialty: string;

  @Prop({ unique: true, index: true })
  whatsapp: string;

  @Prop()
  phone?: string;

  @Prop()
  location: string;

  @Prop()
  instagram?: string;

  @Prop()
  facebook?: string;

  @Prop()
  twitter?: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  photos?: string[];

  @Prop()
  recommendationNote?: string;

@Prop({
  type: Types.ObjectId,
  ref: 'User',
  required: true,
  index: true,
})
addedBy: Types.ObjectId;

  @Prop()
  addedByName: string;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  shareCount: number;

  @Prop({ default: true, index: true })
  isVisible: boolean;

  @Prop({ default: false, index: true })
  deleted: boolean;

  @Prop()
  deletedAt?: Date;

  // virtual (TypeScript only)
  recommender?: User;
}


export const VendorSchema = SchemaFactory.createForClass(Vendor);


VendorSchema.virtual('recommender', {
  ref: 'User',
  localField: 'addedBy',
  foreignField: '_id',
  justOne: false,
});

