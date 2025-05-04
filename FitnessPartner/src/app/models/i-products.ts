export interface IProducts {
    _id?: number;
    id: number;                          // Unique ID of the product
    name: string;                        // Name of the product
    image: string;                       // Main image URL of the product
    description: string;                 // Description of the product
    expiration_date: string;             // Expiration date of the product
    price: number;                       // Price of the product
    brand: string;                       // Brand name of the product
    available_flavors: string[];         // Array of available flavors
    available_size: string;              // Size of the product (e.g., "2 lb", "3 lb")
    product_images: { [key: string]: string };  // Mapping of flavors to images
    category: string;                    // Category of the product (e.g., "Protein", "Creatine")
    discount?: number;
    isHot?:boolean;
    isNew?:boolean;
    quantity:number;
    inStock:boolean;
    flavor_quantity: { [key: string]: number };
  }
  
  //id: string | number; 