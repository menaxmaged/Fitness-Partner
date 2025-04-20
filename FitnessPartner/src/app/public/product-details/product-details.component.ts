import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { ITrainerProducts } from '../../models/i-trainer-products';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-details',
  imports: [CommonModule,RouterModule,RouterLink],
  templateUrl: './product-details.component.html',
  styles: ``,
})
export class ProductDetailsComponent implements OnInit {
  product!: ITrainerProducts;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServicesService
  ) {}
  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService
      .getProductById(productId)
      .subscribe((data: ITrainerProducts) => {
        this.product = data;
      });
  }
}
