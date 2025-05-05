// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, FlattenMaps } from 'mongoose';

// @Schema({ _id: false })
// export class OrderProduct {
//   @Prop({ required: true })
//   productId: string;

//   @Prop({ 
//     required: true,
//     type: Number,
//     min: 0,
//     default: 0,
//     set: (v: any) => {
//       const value = Number(v);
//       return !isNaN(value) && isFinite(value) ? value : 0;
//     }
//   })
//   quantity: number;

//   @Prop()
//   flavor: string;

//   @Prop({ 
//     required: true,
//     type: Number,
//     min: 0,
//     default: 0,
//     set: (v: any) => {
//       const value = Number(v);
//       return !isNaN(value) && isFinite(value) ? value : 0;
//     }
//   })
//   price: number;

//   @Prop({ required: true })
//   name: string;
// }

// @Schema({ _id: false })
// export class Order {
//   @Prop({
//     type: Number,
//     required: true,
//     min: 0,
//     default: 0,
//     set: (v: any) => {
//       const value = Number(v);
//       return !isNaN(value) && isFinite(value) ? value : 0;
//     }
//   })
//   total: number;

//   @Prop({ required: true })
//   id: string;

//   @Prop({ required: true })
//   transactionId: string;

//   @Prop({ type: [OrderProduct], required: true })
//   products: OrderProduct[];

//   @Prop({ type: Date, required: true })
//   date: Date;

//   @Prop({
//     type: {
//       street: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       zipCode: { type: String, required: true },
//       country: { type: String, required: true }
//     },
//     required: true
//   })
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };

//   @Prop({ 
//     type: String,
//     enum: ['confirmed', 'shipped', 'delivered', 'cancelled'],
//     default: 'confirmed'
//   })
//   status: string;

//   @Prop({ required: true })
//   userId: string;

//   @Prop({ required: true })
//   userEmail: string;
// }



// //address
// @Schema({ _id: false })
// export class Address {
//   @Prop({ required: true })
//   id: string;

//   @Prop({ required: true })
//   street: string;

//   @Prop({ required: true })
//   city: string;

//   @Prop({ required: true })
//   state: string;

//   @Prop({ required: true })
//   zipCode: string;

//   @Prop({ required: true })
//   country: string;
  
//   @Prop({ default: false })
//   isDefault: boolean;
// }


// @Schema()
// export class User {
//   @Prop({ required: true })
//   id: string;

//   @Prop()
//   gender: string;

//   @Prop({ default: '01xxxxxxxxx' })
//   mobile: string;

//   @Prop({ required: true })
//   fName: string;

//   @Prop({ required: true })
//   lName: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ type: [Order], default: [] })
//   orders: Order[];

//   @Prop()
//   avatar: string;

//   @Prop({ default: false })
//   isVerified: boolean;

//   @Prop({ default: Date.now })
//   createdAt: Date;

//   @Prop({ type: [String], default: [] })
//   favorites: string[];

//   @Prop({
//     type: String,
//     enum: ['user', 'trainer', 'admin'],
//     default: 'user',
//   })
//   role: string;

//   @Prop({ type: [Address], default: [] })
//     addresses: Address[];
// }

// export type LeanOrder = FlattenMaps<Order & Document>;
// export const UserSchema = SchemaFactory.createForClass(User);
// export type UserDocument = User & Document;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Document, FlattenMaps } from 'mongoose';

@Schema({ _id: false })
export class OrderProduct {
  @Prop({ required: true })
  productId: string;

  @Prop({ 
    required: true,
    type: Number,
    min: 0,
    default: 0,
    set: (v: any) => {
      const value = Number(v);
      return !isNaN(value) && isFinite(value) ? value : 0;
    }
  })
  quantity: number;

  @Prop()
  flavor: string;

  @Prop({ 
    required: true,
    type: Number,
    min: 0,
    default: 0,
    set: (v: any) => {
      const value = Number(v);
      return !isNaN(value) && isFinite(value) ? value : 0;
    }
  })
  price: number;

  @Prop({ required: true })
  name: string;
}

@Schema({ _id: false })
export class Order {
  @Prop({
    type: Number,
    required: true,
    min: 0,
    default: 0,
    set: (v: any) => {
      const value = Number(v);
      return !isNaN(value) && isFinite(value) ? value : 0;
    }
  })
  total: number;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ type: [OrderProduct], required: true })
  products: OrderProduct[];

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    required: true
  })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Prop({ 
    type: String,
    enum: ['confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  })
  status: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userEmail: string;
}

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  country: string;
  
  @Prop({ default: false })
  isDefault: boolean;
}


// DTO for Address
export class AddressDto {
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() zipCode: string;
  @IsString() country: string;
  @IsBoolean() @IsOptional() isDefault?: boolean; // Optional field
}

@Schema()
export class User {
  @Prop({ required: true })
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

  @Prop({ type: [Order], default: [] })
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
    default: 'user',
  })
  role: string;

  @Prop({ type: [Address], default: [] })
  addresses: Address[];
}

export type LeanOrder = FlattenMaps<Order & Document>;
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;