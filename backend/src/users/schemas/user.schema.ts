// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class Order {
  @Prop()
  id: string;

  @Prop()
  transactionId: string;

  @Prop([String])
  productId: string[];

  @Prop()
  total: number;

  @Prop({ type: Date })
  date: Date;
}

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  gender: string;

  @Prop({ default: '01xxxxxxxxx' })
  mobile: string;

  @Prop({ required: true })
  fName: string;

  @Prop({ required: true })
  lName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [Object], default: [] })
  orders: Order[];

  @Prop()
  avatar: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [String], default: [] })
  favorites: string[];


  @Prop({ 
    type: String, 
    enum: ['user', 'trainer', 'admin'], 
    default: 'user' 
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
