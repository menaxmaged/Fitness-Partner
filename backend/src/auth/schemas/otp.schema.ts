import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now, expires: 600 }) // OTP expires after 10 minutes
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
