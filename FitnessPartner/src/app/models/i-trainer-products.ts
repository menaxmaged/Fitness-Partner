export interface ITrainerProducts {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  product_images: { [key: string]: string };
  available_flavors: string[];
  available_size:string;
  showFlavors?: boolean;
  brand: string;
}
