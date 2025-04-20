import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITrainerProducts } from '../models/i-trainer-products';
@Injectable({
  providedIn: 'root',
})
export class ProductServicesService {
  private productsUrl = 'http://localhost:3000/products';
  constructor(private ProductHttp: HttpClient) {}
  getAllProducts(): Observable<ITrainerProducts[]> {
    return this.ProductHttp.get<ITrainerProducts[]>(this.productsUrl);
  }
  getProductById(id: number) {
    return this.ProductHttp.get<ITrainerProducts>(`${this.productsUrl}/${id}`);
  }
}
