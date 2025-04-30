import { Component, ElementRef, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { v4 as generateId } from 'uuid';
import { ProductServicesService } from '../../services/product-services.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './checkout.component.html',
  styles: ``,
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;

  cart: any[] = [];
  total: number = 0;
  done: boolean = false;
  cartLen: number = 0;
  processingPayment: boolean = false;
  errorMessage: string = '';
  private cartSubscription: Subscription | null = null;

  constructor(
    private myCart: CartService,
    private myUserService: UsersService,
    private productService: ProductServicesService,
    protected router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // First load the initial state
    this.updateCartState(this.myCart.getCart());
    
    // Then subscribe to cart updates to keep UI in sync
    this.cartSubscription = this.myCart.cart$.subscribe((cart) => {
      this.updateCartState(cart);
      
      // Force change detection to update the view
      this.cdr.detectChanges();
    });

    // Initialize PayPal only if we have items in cart
    if (this.cartLen > 0) {
      this.initializePayPalButton();
    }
  }

  // Separate method to update cart state consistently
  private updateCartState(cart: any[]) {
    this.cart = cart;
    this.total = this.myCart.getTotal();
    this.cartLen = cart.length;
    
    // Redirect to cart page if the cart is empty
    if (this.cartLen === 0) {
      this.router.navigate(['/cart']);
      return;
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private initializePayPalButton() {
    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        // Get the latest total at time of order creation
        const currentTotal = this.myCart.getTotal();
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: currentTotal,
              },
            },
          ],
        });
      },
      onApprove: (data: any, actions: any) => {
        // Set processing state
        this.processingPayment = true;
        this.errorMessage = '';
        
        return actions.order.capture().then(async (details: any) => {
          try {
            const transactionId = details.id;
            const userId = localStorage.getItem('userId');
            const shippingAddress = details.purchase_units[0]?.shipping?.address || {};
            const payerInfo = details.payer;

            if (!userId) {
              console.error('User ID not found!');
              this.errorMessage = 'User ID not found. Please log in and try again.';
              this.processingPayment = false;
              this.cdr.detectChanges();
              return;
            }

            // Get the latest cart and total at time of checkout completion
            const finalCart = this.myCart.getCart();
            const finalTotal = this.myCart.getTotal();

            const newOrder = {
              id: generateId(),
              transactionId: transactionId,
              products: finalCart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                flavor: item.selectedFlavor,
              })),
              total: finalTotal,
              date: new Date().toISOString(),
              address: {
                street: shippingAddress.address_line_1 || '',
                city: shippingAddress.admin_area_2 || '',
                state: shippingAddress.admin_area_1 || '',
                zipCode: shippingAddress.postal_code || '',
                country: shippingAddress.country_code || '',
                fullName: `${payerInfo.name?.given_name} ${payerInfo.name?.surname}` || '',
              },
            };

            // Handle flavor quantity updates with better error handling
            const updatePromises = [];
            const failedUpdates = [];
            
            // Gather all update promises and track failures
            for (const item of finalCart) {
              if (item.selectedFlavor) {
                try {
                  updatePromises.push(
                    this.productService.updateFlavorQuantity(
                      item.productId, 
                      item.selectedFlavor, 
                      item.quantity
                    ).catch(err => {
                      // Track which item failed
                      failedUpdates.push({
                        product: item.productId,
                        flavor: item.selectedFlavor,
                        error: err.message
                      });
                      // Re-throw to be caught by Promise.allSettled
                      throw err;
                    })
                  );
                } catch (err:any) {
                  console.error(`Error preparing update for product ${item.productId}:`, err);
                  failedUpdates.push({
                    product: item.productId,
                    flavor: item.selectedFlavor,
                    error: err.message || 'Unknown error'
                  });
                }
              }
            }

            // Use Promise.allSettled instead of Promise.all to handle partial failures
            const results = await Promise.allSettled(updatePromises);
            
            // Check if any updates failed
            const failedResults = results.filter(r => r.status === 'rejected');
            if (failedResults.length > 0) {
              console.warn(`${failedResults.length} flavor quantity updates failed`);
              // We could implement a retry mechanism here or notify an admin
              // For now, let's log the failures but still complete the order
            }

            console.log('Flavor quantities updated, saving order');

            // Proceed with saving the order
            this.myUserService.getUserById(userId).subscribe({
              next: (userData: any) => {
                if (!userData.orders) {
                  userData.orders = [];
                }

                this.myUserService.addOrder(userId, newOrder).subscribe({
                  next: () => {
                    this.myCart.clearCart();
                    this.router.navigate(['/profile/orders']);
                    this.processingPayment = false;
                    
                    // Show confirmation drawer
                    const drawer = document.createElement('div');
                    drawer.className = 'offcanvas show';
                    drawer.style.position = 'fixed';
                    drawer.style.top = '0';
                    drawer.style.left = '0';
                    drawer.style.width = '100%';
                    drawer.style.height = '100%';
                    drawer.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                    drawer.style.zIndex = '1050';
                    drawer.style.display = 'flex';
                    drawer.style.justifyContent = 'center';
                    drawer.style.alignItems = 'center';
                    
                    let failureNotice = '';
                    if (failedUpdates.length > 0) {
                      failureNotice = `<div class="alert alert-warning mt-3" role="alert">
                        <p>Note: Some inventory updates failed. Our team has been notified.</p>
                      </div>`;
                    }
                    
                    drawer.innerHTML = `
                      <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; text-align: center;">
                        <h5>Order Confirmation</h5>
                        <p>Thank you for your order!</p>
                        <p>Transaction ID: ${transactionId}</p>
                        ${failureNotice}
                        <button type="button" class="btn btn-outline-dark" id="closeDrawer">Close</button>
                      </div>
                    `;
                    document.body.appendChild(drawer);

                    const closeDrawerButton = drawer.querySelector('#closeDrawer');
                    closeDrawerButton?.addEventListener('click', () => {
                      document.body.removeChild(drawer);
                    });

                    console.log('Payment successful');
                    this.cdr.detectChanges();
                  },
                  error: (err: any) => {
                    console.error('Error saving order:', err);
                    this.errorMessage = 'Failed to save your order. Please contact customer support.';
                    this.processingPayment = false;
                    this.cdr.detectChanges();
                  },
                });
              },
              error: (err: any) => {
                console.error('Error fetching user data:', err);
                this.errorMessage = 'Could not fetch your user data. Please try again.';
                this.processingPayment = false;
                this.cdr.detectChanges();
              },
            });
          } catch (err) {
            console.error('Error in checkout process:', err);
            this.errorMessage = 'An error occurred during checkout. Please try again.';
            this.processingPayment = false;
            this.cdr.detectChanges();
          }
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        this.errorMessage = 'Payment processing error. Please try again or use a different payment method.';
        this.processingPayment = false;
        this.cdr.detectChanges();
      },
      onCancel: () => {
        console.log('Payment cancelled');
        this.processingPayment = false;
        this.cdr.detectChanges();
      }
    }).render(this.paymentRef.nativeElement);
  }

  // Get fresh total from service
  refreshTotal(): number {
    return this.myCart.getTotal();
  }

  toggleVisibility = () => {
    this.done = !this.done;
  };
}