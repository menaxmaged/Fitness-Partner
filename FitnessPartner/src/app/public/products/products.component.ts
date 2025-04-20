import { Component,OnInit } from '@angular/core';
import {ProductServicesService} from '../../services/product-services.service';
import {ITrainerProducts} from '../../models/i-trainer-products';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-products',
  imports: [CommonModule,RouterModule,RouterLink],
  templateUrl: './products.component.html',
  styles: ``
})
export class ProductsComponent implements OnInit{
  products: ITrainerProducts[] = [];
  constructor(private productService: ProductServicesService) {}
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data: ITrainerProducts[]) => {
       this.products = data.map(product => ({
        ...product,
        showFlavors: false
      }));
    });
  }

  toggleFlavors(product: ITrainerProducts): void {
    product.showFlavors = !product.showFlavors;
  }
  }
