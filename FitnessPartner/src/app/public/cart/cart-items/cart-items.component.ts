import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-items',
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './cart-items.component.html',
  styles: [
    `
      /* Your styles here */
    `,
  ],
})
export class CartItemsComponent implements OnInit {
  cartItems: any[] = [];

  constructor(
    private myCart: CartService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    // Subscribe to cart updates
    this.myCart.cart$.subscribe((cart) => {
      this.cartItems = cart;
    });
  }

  addToCart(product: any) {
    const availableFlavors = product.available_flavors || [];

    this.myCart
      .addToCart({
        productId: product.productId || product._id || product.id,
        name: product.name,
        image: product.image,
        price: Number(product.price),
        selectedFlavor:
          product.selectedFlavor ||
          (availableFlavors?.length ? availableFlavors[0] : 'Unflavored'),
        quantity: 1,
      })
      .subscribe({
        next: () => {
          console.log('Product added successfully to cart.');
        },
        error: (err) => {
          console.error('Failed to add product to cart', err);
        },
      });
  }

  removeFromCart(product: any) {
    this.myCart.removeOneFromCart(product);
  }

  trashItem(product: any) {
    const selectedFlavor = product.selectedFlavor || '';
    console.log('Trashing item:', {
      productId: product.productId,
      name: product.name,
      selectedFlavor: selectedFlavor,
    });
    this.myCart.deleteFromCart(product.productId, selectedFlavor);
  }

  trackByFn(index: number, item: any): number {
    return item.id; // Assuming each item has a unique 'id' field
  }
}
