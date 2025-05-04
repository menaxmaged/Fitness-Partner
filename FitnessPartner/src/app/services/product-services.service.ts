import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IProducts } from '../models/i-products';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {
  private productsUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Generate authorization headers for admin endpoints
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

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

  createProduct(product: IProducts): Observable<IProducts> {
    return this.http.post<IProducts>(`${this.productsUrl}/admin`, product, { 
      headers: this.getAuthHeaders() 
    });
  }
  
  updateProduct(id: string | number, product: IProducts): Observable<IProducts> {
    return this.http.put<IProducts>(`${this.productsUrl}/admin/${id}`, product, { 
      headers: this.getAuthHeaders() 
    });
  }
  
  deleteProduct(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/admin/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }
  
  updateFlavorQuantityAdmin(productId: string, flavor: string, newQuantity: number): Promise<any> {
    const body = { flavor, quantity: newQuantity };
    const url = `${this.productsUrl}/${productId}/admin/flavors`;

    const response$ = this.http.patch<any>(url, body, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Admin update error:', error);
        return throwError(() => new Error(error.error?.message || 'User not authorized'));
      })
    );
  
    return firstValueFrom(response$);
  }
  
  // Method to delete a specific flavor from a product
  deleteFlavorFromProduct(productId: string, flavor: string): Promise<any> {
    const url = `${this.productsUrl}/${productId}/admin/flavor/${encodeURIComponent(flavor)}`;
    
    const response$ = this.http.delete<any>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to delete flavor:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete flavor'));
      })
    );
    
    return firstValueFrom(response$);
  }


  addFlavorToProduct(productId: string, flavorName: string, quantity: number, imageUrl: string): Promise<any> {
    // First get the current product to ensure we have the latest data
    return firstValueFrom(this.getProductById(productId))
      .then(product => {
        // Update the product with the new flavor
        if (!product.available_flavors) {
          product.available_flavors = [];
        }
        if (!product.flavor_quantity) {
          product.flavor_quantity = {};
        }
        if (!product.product_images) {
          product.product_images = {};
        }
        
        // Add the new flavor data
        if (!product.available_flavors.includes(flavorName)) {
          product.available_flavors.push(flavorName);
        }
        product.flavor_quantity[flavorName] = quantity;
        product.product_images[flavorName] = imageUrl;
        
        // Save the updated product
        return firstValueFrom(this.updateProduct(productId, product));
      })
      .catch(error => {
        console.error('Error adding flavor to product:', error);
        return Promise.reject(error);
      });
  }
}