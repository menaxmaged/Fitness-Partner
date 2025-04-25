import { Document } from 'mongoose';
import { Product } from '../schema/product.schema';

export type ProductDocument = Product & Document;