import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: 3600 }) // 1 hour expiration
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
