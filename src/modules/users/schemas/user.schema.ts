import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User extends Document {
  @Prop({ unique: true, index: true })
  phone: string;

  @Prop()
  name?: string;

  @Prop()
  nameUpdatedAt?: Date;

  @Prop({ default: 0 })
  pageViewCount: number;

  @Prop()
  role?: string;

  // Virtual for vendors added by this user
  // This would be populated from vendors collection
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtuals for relationships
UserSchema.virtual('vendors', {
  ref: 'Vendor',
  localField: '_id',
  foreignField: 'addedBy',
});

UserSchema.virtual('notifications', {
  ref: 'Notification',
  localField: '_id',
  foreignField: 'userId',
});