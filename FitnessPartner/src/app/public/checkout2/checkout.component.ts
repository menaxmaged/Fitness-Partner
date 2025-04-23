import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CartTotalComponent } from '../cart/cart-total/cart-total.component';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-checkout',
   imports: [CommonModule, FormsModule, CartTotalComponent,RouterModule],
  templateUrl: './checkout.component.html',
  styles: ``,
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  selectedPaymentMethod: string = '';

  constructor(private cartService: CartService,private router:Router) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  placeOrder() {
    this.router.navigate(['/checkout-confirmation']);
    this.cartService.clearCart();
  }
}
