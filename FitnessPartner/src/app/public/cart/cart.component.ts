import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartTotalComponent } from './cart-total/cart-total.component';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    TranslateModule,
    RouterModule,
    CommonModule,
    CartTotalComponent,
    CartItemsComponent,
  ],
  templateUrl: './cart.component.html',
  styles: ``,
})
export class CartComponent implements OnInit, OnDestroy {
  cart: any[] = [];
  private cartSub!: Subscription;

  constructor(
    private myCart: CartService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.cartSub = this.myCart.cart$.subscribe((cart) => {
      this.cart = cart;
      console.log(this.cart, 'CART UPDATED');
    });
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}
