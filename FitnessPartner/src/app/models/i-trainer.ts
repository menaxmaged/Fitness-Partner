import {  IFAQ } from './i-faq';
export interface ITrainer {
specialty: any;
rating: any;
  id: number;
  name: string;
  image: string;
  bio: string;
  faq: IFAQ[];
  products: { id: number }[];
}
