import {  IFAQ } from './i-faq';
export interface ITrainer {
  id: number;
  name: string;
  image: string;
  bio: string;
  faq: IFAQ[];
  products: { id: number }[];
}
