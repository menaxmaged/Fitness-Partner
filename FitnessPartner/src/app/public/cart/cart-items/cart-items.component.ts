import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-cart-items',
  imports: [RouterModule, CommonModule],
  templateUrl: './cart-items.component.html',
  styles: [`/* Your styles here */`],
})
export class CartItemsComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private myCart: CartService) {}

  ngOnInit() {
    // Subscribe to cart updates
    this.myCart.cart$.subscribe((cart) => {
      this.cartItems = cart;
    });
  }

  addToCart(product: any) {
    const availableFlavors = product.available_flavors || []; // Default to an empty array if not provided
    this.myCart.addToCart(product, availableFlavors);
  }

  removeFromCart(product: any) {
    this.myCart.removeOneFromCart(product);
  }

  trashItem(product: any) {
    const selectedFlavor = product.selectedFlavor || ''; // Default to empty string if no flavor
    console.log('Trashing item:', {
      productId: product.productId,
      name: product.name,
      selectedFlavor: selectedFlavor
    });
    this.myCart.deleteFromCart(product.productId, selectedFlavor);
  }
  trackByFn(index: number, item: any): number {
    return item.id; // Assuming each item has a unique 'id' field
  }
}
