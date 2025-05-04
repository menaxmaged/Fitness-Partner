import {  IFAQ } from './i-faq';
export interface ITrainer {
specialty: any;
rating: any;
  id: any;
  name: string;
  image: string;
  bio: string;
  faq: IFAQ[];
  products: { id: number }[];
  fName: string;
  lName: string;
  email: string;
  mobile?: string;
  gender?: string;
  createdAt?: Date;
  isVerified?: boolean;
}
