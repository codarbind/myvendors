import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
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

  @Prop({ index: true })
  addedBy: string;

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
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
