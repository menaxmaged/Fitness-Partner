// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { IProducts } from '../models/i-products';  // Import the IProducts interface

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductServicesService {
//   private productsUrl = 'http://localhost:3000/products';  // Update this to your actual API URL

//   constructor(private ProductHttp: HttpClient) {}

//   // Get all products
//   getAllProducts(): Observable<IProducts[]> {
//     return this.ProductHttp.get<IProducts[]>(this.productsUrl);
//   }

//   // Get product by ID
//   getProductById(id: number): Observable<IProducts> {
//     return this.ProductHttp.get<IProducts>(`${this.productsUrl}/${id}`);
//   }

//   // Get products by category
//   getProductsByCategory(category: string): Observable<IProducts[]> {
//     return this.ProductHttp.get<IProducts[]>(this.productsUrl, {
//       params: { category },
//     });
//   }
// }
//////////////////////// BACK END TESTING BELOW ////////////////// DO NOT DELETE ABOVE CODE
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProducts } from '../models/i-products';

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {
  private productsUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }

  getAllProducts(category?: string): Observable<IProducts[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<IProducts[]>(this.productsUrl, { params });
  }

  getProductById(id: string | number): Observable<IProducts> {
    return this.http.get<IProducts>(`${this.productsUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<IProducts[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<IProducts[]>(this.productsUrl, { params });
  }
}