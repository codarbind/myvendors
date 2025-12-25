import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class VendorInvite extends Document {
  @Prop({ index: true })
  invitedBy: string;

  @Prop()
  invitedByName: string;

  @Prop({ index: true })
  vendorPhone: string;

  @Prop()
  vendorName?: string;

  @Prop()
  specialty?: string;

  @Prop({ unique: true, index: true })
  token: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt?: Date;

  @Prop({ default: false, index: true })
  deleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const VendorInviteSchema =
  SchemaFactory.createForClass(VendorInvite);
