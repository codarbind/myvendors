import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationType = 'invite_completed' | 'vendor_listed';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ index: true })
  userId: string;

  @Prop({ index: true })
  type: NotificationType;

  @Prop()
  message: string;

  @Prop()
  vendorId?: string;

  @Prop({ default: false, index: true })
  read: boolean;
}

export const NotificationSchema =
  SchemaFactory.createForClass(Notification);
