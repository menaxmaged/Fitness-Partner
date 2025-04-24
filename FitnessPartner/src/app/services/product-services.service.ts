// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { ITrainerProducts } from '../models/i-trainer-products';
// @Injectable({
//   providedIn: 'root',
// })
// export class ProductServicesService {
//   private productsUrl = 'http://localhost:3000/products';
//   constructor(private ProductHttp: HttpClient) {}
//   getAllProducts(): Observable<ITrainerProducts[]> {
//     return this.ProductHttp.get<ITrainerProducts[]>(this.productsUrl);
//   }
//   getProductById(id: number) {
//     return this.ProductHttp.get<ITrainerProducts>(`${this.productsUrl}/${id}`);
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { ITrainerProducts } from '../models/i-trainer-products';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductServicesService {
//   private productsUrl = 'http://localhost:3000/products';  // Update this to your actual API URL

//   constructor(private ProductHttp: HttpClient) {}

//   // Get all products
//   getAllProducts(): Observable<ITrainerProducts[]> {
//     return this.ProductHttp.get<ITrainerProducts[]>(this.productsUrl);
//   }

//   // Get product by ID
//   getProductById(id: number): Observable<ITrainerProducts> {
//     return this.ProductHttp.get<ITrainerProducts>(`${this.productsUrl}/${id}`);
//   }

//   // Get products by category
//   getProductsByCategory(category: string): Observable<ITrainerProducts[]> {
//     return this.ProductHttp.get<ITrainerProducts[]>(this.productsUrl, {
//       params: { category },
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProducts } from '../models/i-products';  // Import the IProducts interface

@Injectable({
  providedIn: 'root',
})
export class ProductServicesService {
  private productsUrl = 'http://localhost:3000/products';  // Update this to your actual API URL

  constructor(private ProductHttp: HttpClient) {}

  // Get all products
  getAllProducts(): Observable<IProducts[]> {
    return this.ProductHttp.get<IProducts[]>(this.productsUrl);
  }

  // Get product by ID
  getProductById(id: number): Observable<IProducts> {
    return this.ProductHttp.get<IProducts>(`${this.productsUrl}/${id}`);
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<IProducts[]> {
    return this.ProductHttp.get<IProducts[]>(this.productsUrl, {
      params: { category },
    });
  }
}
