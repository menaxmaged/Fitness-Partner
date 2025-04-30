import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-total',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './cart-total.component.html',
  styles: ``
})
export class CartTotalComponent implements OnInit, OnDestroy {
  total: number = 0;
  private cartSub!: Subscription;

  constructor(private myCart: CartService) {}

  ngOnInit() {
    this.cartSub = this.myCart.cart$.subscribe(cart => {
      this.total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}
