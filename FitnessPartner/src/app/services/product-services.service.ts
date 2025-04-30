import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
    return this.http.get<IProducts>(`${this.productsUrl}/${id}`).pipe(
      map(product => {
        // Ensure product_images is properly parsed as an object
        if (product.product_images && typeof product.product_images === 'object' && !Array.isArray(product.product_images)) {
          // It's already a plain object
        } else {
          // If it's not an object, transform it (this shouldn't happen with a correct schema)
          product.product_images = {};
        }
        return product;
      })
    );
  }

  getProductsByCategory(category: string): Observable<IProducts[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<IProducts[]>(this.productsUrl, { params });
  }

  async updateFlavorQuantity(id: string, flavor: string, quantity: number): Promise<any> {
    try {
      // First validate that the product exists
      const product = await firstValueFrom(this.getProductById(id));
      
      // TypeScript safety: ensure available_flavors is an array
      if (!product.available_flavors || !Array.isArray(product.available_flavors)) {
        console.error(`Product ${id} has no available flavors`);
        return Promise.reject(new Error(`Product has no available flavors`));
      }
      
      // Find the exact flavor name from available_flavors (to handle case sensitivity)
      const exactFlavorName = product.available_flavors.find(
        f => typeof f === 'string' && f.toLowerCase() === flavor.toLowerCase()
      );
      
      if (!exactFlavorName) {
        console.error(`Flavor '${flavor}' does not exist in available flavors for product ${id}`);
        return Promise.reject(new Error(`Flavor '${flavor}' does not exist for this product`));
      }
      
      // Check if the flavor exists in the flavor_quantity object - using string index now
      if (!product.flavor_quantity || product.flavor_quantity[exactFlavorName] === undefined) {
        console.error(`Flavor '${exactFlavorName}' exists but has no quantity set for product ${id}`);
        return Promise.reject(new Error(`Flavor '${exactFlavorName}' has no quantity set for this product`));
      }
      
      // Check if there's enough quantity
      if (product.flavor_quantity[exactFlavorName] < quantity) {
        console.error(`Not enough inventory for flavor '${exactFlavorName}'. Available: ${product.flavor_quantity[exactFlavorName]}, Requested: ${quantity}`);
        return Promise.reject(new Error(`Not enough inventory for flavor '${exactFlavorName}'`));
      }
      
      // If validation passes, proceed with the request using the exact flavor name
      const response = this.http.patch<any>(`${this.productsUrl}/${id}/flavors`, {
        flavor: exactFlavorName, // Use the exact flavor name from available_flavors
        quantity: quantity,
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating flavor quantity:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to update flavor quantity'));
        })
      );
      
      return firstValueFrom(response);
    } catch (error) {
      console.error('Error in updateFlavorQuantity:', error);
      return Promise.reject(error);
    }
  }
}
