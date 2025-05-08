
import { Component, ElementRef, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { v4 as generateId } from 'uuid';
import { ProductServicesService } from '../../services/product-services.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styles: ``
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('paymentRef', { static: false }) paymentRef!: ElementRef;

  cart: any[] = [];
  total: number = 0;
  done: boolean = false;
  cartLen: number = 0;
  processingPayment: boolean = false;
  processingOrder: boolean = false;
  errorMessage: string = '';
  private cartSubscription: Subscription | null = null;
  
  paymentMethod: 'paypal' | 'cod' = 'paypal';
  
  savedAddresses: Address[] = [];
  addressType: 'existing' | 'new' = 'existing';
  selectedAddressId: string = '';
  userHasAddress: boolean = false;
  saveNewAddress: boolean = false;
  makeDefaultAddress: boolean = false;
  newAddress: Address = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  };

  constructor(
    private myCart: CartService,
    private myUserService: UsersService,
    private productService: ProductServicesService,
    protected router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.updateCartState(this.myCart.getCart());
    
    this.cartSubscription = this.myCart.cart$.subscribe((cart) => {
      this.updateCartState(cart);
      if (this.paymentMethod === 'paypal' && this.cartLen > 0) {
        this.initializePayPalAfterViewInit();
      }
      this.cdr.detectChanges();
    });

    this.loadUserAddresses();
  }

  private updateCartState(cart: any[]) {
    this.cart = cart;
    this.total = this.myCart.getTotal();
    this.cartLen = cart.length;
    
    if (this.cartLen === 0) {
      this.router.navigate(['/cart']);
    }
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private initializePayPalAfterViewInit() {
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.paymentRef?.nativeElement) {
        this.initializePayPalButton();
      }
    }, 0);
  }

  loadUserAddresses() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.myUserService.getUserAddresses(userId).subscribe({
      next: (addresses) => {
        this.savedAddresses = addresses;
        this.userHasAddress = addresses.length > 0;
        
        const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
        this.selectedAddressId = defaultAddress?.id || addresses[0]?.id || '';
        
        if (!this.userHasAddress) this.addressType = 'new';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading addresses:', err);
        this.addressType = 'new';
        this.cdr.detectChanges();
      }
    });
  }

  onPaymentMethodChange() {
    if (this.paymentMethod === 'cod' && !this.userHasAddress) {
      this.addressType = 'new';
    }
    
    if (this.paymentMethod === 'paypal') {
      this.initializePayPalAfterViewInit();
    }
  }

  onAddressTypeChange() {
    this.cdr.detectChanges();
  }

  isAddressValid(): boolean {
    if (this.addressType === 'existing') return !!this.selectedAddressId;
    
    return !!(
      this.newAddress.street &&
      this.newAddress.city &&
      this.newAddress.state &&
      this.newAddress.zipCode &&
      this.newAddress.country
    );
  }


  // Save new address to user profile
 // checkout.component.ts
 saveAddress(userId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Ensure all address fields are properly formatted
    const addressToSave = {
      street: this.newAddress.street.trim(),
      city: this.newAddress.city.trim(),
      state: this.newAddress.state.trim(),
      zipCode: this.newAddress.zipCode.toString().trim(), // Ensure string format
      country: this.newAddress.country.trim(),
      isDefault: this.makeDefaultAddress
    };

    // Validate address data before sending to API
    if (!addressToSave.street || !addressToSave.city || !addressToSave.state || 
        !addressToSave.zipCode || !addressToSave.country) {
      reject('All address fields are required');
      return;
    }

    console.log('Saving address:', addressToSave);
    
    this.myUserService.saveUserAddress(userId, addressToSave).subscribe({
      next: (response) => {
        console.log('Address saved successfully:', response);
        
        // Check if response has an id field before trying to set as default
        if (this.makeDefaultAddress && response && response.id) {
          this.myUserService.setDefaultAddress(userId, response.id).subscribe({
            next: () => {
              console.log('Address set as default');
              resolve(response);
            },
            error: (err) => {
              console.error('Error setting default address:', err);
              // Still resolve with the saved address even if setting default fails
              resolve(response);
            }
          });
        } else {
          resolve(response);
        }
      },
      error: (err) => {
        console.error('Failed to save address:', err);
        // Log more detailed error info
        if (err.error) {
          console.error('Error details:', err.error);
        }
        // Use a more specific error message based on the response if possible
        const errorMsg = err.error?.message || err.message || 'Unknown error saving address';
        this.errorMessage = errorMsg;
        reject(errorMsg);
      }
    });
  });
}
  // Place Cash on Delivery order
  placeOrderCOD() {
    this.processingOrder = true;
    this.errorMessage = '';
    
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        this.errorMessage = 'User ID not found. Please log in and try again.';
        this.processingOrder = false;
        this.cdr.detectChanges();
        return;
      }
      
      // Get the latest cart and total
      const finalCart = this.myCart.getCart();
      const finalTotal = this.myCart.getTotal();
      
      // Get address data
      let orderAddress: any;
      
      // Process address - either get existing or create new
      const processAddress = () => {
        return new Promise<any>((resolve, reject) => {
          if (this.addressType === 'existing' && this.selectedAddressId) {
            // Use selected address
            orderAddress = this.savedAddresses.find(addr => addr.street === this.selectedAddressId);
            if (!orderAddress) {
              reject('Selected address not found.');
              return;
            }
            resolve(orderAddress);
          } else {
            // Use new address
            // Save new address if requested
            if (this.saveNewAddress) {
              this.saveAddress(userId)
                .then(savedAddress => {
                  orderAddress = savedAddress;
                  resolve(orderAddress);
                })
                .catch(err => {
                  console.error('Failed to save address:', err);
                  // Use the address anyway but don't save it
                  orderAddress = { ...this.newAddress };
                  resolve(orderAddress);
                });
            } else {
              // Just use the address without saving
              orderAddress = { ...this.newAddress };
              resolve(orderAddress);
            }
          }
        });
      };
      
      // Process address first, then create order
      processAddress().then(address => {
        // Create order object
        const newOrder = {
          id: generateId(),
          transactionId: `COD-${Date.now()}`, // Generate a unique ID for COD orders
          products: finalCart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            flavor: item.selectedFlavor,
            price: item.price,
            name: item.name
          })),
          total: finalTotal,
          date: new Date().toISOString(),
          paymentMethod: 'cod',
          paymentStatus: 'pending', // COD payment is pending until delivery
          status: 'processing',
          address: address
        };
        
        // Handle flavor quantity updates
        const updatePromises = [];
        const failedUpdates = [];
        
        for (const item of finalCart) {
          if (item.selectedFlavor) {
            try {
              updatePromises.push(
                this.productService.updateFlavorQuantity(
                  item.productId, 
                  item.selectedFlavor, 
                  item.quantity
                ).catch(err => {
                  failedUpdates.push({
                    product: item.productId,
                    flavor: item.selectedFlavor,
                    error: err.message
                  });
                  throw err;
                })
              );
            } catch (err: any) {
              console.error(`Error preparing update for product ${item.productId}:`, err);
              failedUpdates.push({
                product: item.productId,
                flavor: item.selectedFlavor,
                error: err.message || 'Unknown error'
              });
            }
          }
        }
        
        // Process all flavor quantity updates
        Promise.allSettled(updatePromises).then(results => {
          const failedResults = results.filter(r => r.status === 'rejected');
          if (failedResults.length > 0) {
            console.warn(`${failedResults.length} flavor quantity updates failed`);
          }
          
          // Save the order
          this.myUserService.addOrder(userId, newOrder).subscribe({
            next: () => {
              this.myCart.clearCart();
              
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
                  <p>Order ID: ${newOrder.id}</p>
                  <p>Payment method: Cash on Delivery</p>
                  ${failureNotice}
                  <button type="button" class="btn btn-outline-dark" id="closeDrawer">Close</button>
                </div>
              `;
              document.body.appendChild(drawer);

              const closeDrawerButton = drawer.querySelector('#closeDrawer');
              closeDrawerButton?.addEventListener('click', () => {
                document.body.removeChild(drawer);
              });
              
              this.processingOrder = false;
              this.router.navigate(['/profile/orders']);
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error saving order:', err);
              this.errorMessage = 'Failed to save your order. Please try again or contact customer support.';
              this.processingOrder = false;
              this.cdr.detectChanges();
            }
          });
        });
      }).catch(err => {
        this.errorMessage = err || 'An error occurred with the address. Please try again.';
        this.processingOrder = false;
        this.cdr.detectChanges();
      });
      
    } catch (err) {
      console.error('Error in COD checkout process:', err);
      this.errorMessage = 'An error occurred during checkout. Please try again.';
      this.processingOrder = false;
      this.cdr.detectChanges();
    }
  }

 private initializePayPalButton() {
    if (!this.paymentRef?.nativeElement) {
      console.warn('Payment container not available');
      return;
    }

    // Clear previous buttons
    this.paymentRef.nativeElement.innerHTML = '';

    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        const currentTotal = this.myCart.getTotal();
        return actions.order.create({
          purchase_units: [{
            amount: { value: currentTotal }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        this.processingPayment = true;
        this.errorMessage = '';
        
        try {
          const details = await actions.order.capture();
          const transactionId = details.id;
          const userId = localStorage.getItem('userId');
          
          if (!userId) {
            throw new Error('User ID not found');
          }

          const finalCart = this.myCart.getCart();
          const finalTotal = this.myCart.getTotal();
          
          // Process flavor updates
          const { failedUpdates } = await this.handleFlavorUpdates(finalCart);

          // Create order object
          const newOrder = this.createPayPalOrder(transactionId, finalCart, finalTotal, details);
          
          // Save order and handle UI
          await this.savePayPalOrder(userId, newOrder, failedUpdates, transactionId);
          
          this.myCart.clearCart();
          this.showConfirmationDrawer(transactionId, failedUpdates);
          this.router.navigate(['/profile/orders']);

        } catch (err) {
          this.handlePaymentError(err);
        } finally {
          this.processingPayment = false;
          this.cdr.detectChanges();
        }
      },
      onError: (err: any) => this.handlePaymentError(err),
      onCancel: () => this.handlePaymentCancel()
    }).render(this.paymentRef.nativeElement);
  }

  private async handleFlavorUpdates(finalCart: any[]) {
    const updatePromises = [];
    const failedUpdates = [];
    
    for (const item of finalCart) {
      if (item.selectedFlavor) {
        try {
          updatePromises.push(
            this.productService.updateFlavorQuantity(
              item.productId, 
              item.selectedFlavor, 
              item.quantity
            ).catch(err => {
              failedUpdates.push({
                product: item.productId,
                flavor: item.selectedFlavor,
                error: err.message
              });
              throw err;
            })
          );
        } catch (err: any) {
          failedUpdates.push({
            product: item.productId,
            flavor: item.selectedFlavor,
            error: err.message || 'Unknown error'
          });
        }
      }
    }

    await Promise.allSettled(updatePromises);
    return { failedUpdates };
  }

  private createPayPalOrder(transactionId: string, finalCart: any[], total: number, details: any) {
    const shippingAddress = details.purchase_units[0]?.shipping?.address || {};
    const payerInfo = details.payer;

    return {
      id: generateId(),
      transactionId,
      products: finalCart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        flavor: item.selectedFlavor,
        price: item.price,
        name: item.name
      })),
      total,
      date: new Date().toISOString(),
      paymentMethod: 'paypal',
      paymentStatus: 'completed',
      status: 'processing',
      address: {
        id: generateId(),
        street: shippingAddress.address_line_1 || '',
        city: shippingAddress.admin_area_2 || '',
        state: shippingAddress.admin_area_1 || '',
        zipCode: shippingAddress.postal_code || '',
        country: shippingAddress.country_code || '',
        fullName: `${payerInfo.name?.given_name} ${payerInfo.name?.surname}` || '',
        isDefault: false
      }
    };
  }

  private async savePayPalOrder(userId: string, order: any, failedUpdates: any[], transactionId: string) {
    try {
      await this.myUserService.addOrder(userId, order).toPromise();
      
      if (this.saveNewAddress) {
        await this.myUserService.saveUserAddress(userId, order.address).toPromise();
        if (this.makeDefaultAddress) {
          await this.myUserService.setDefaultAddress(userId, order.address.id).toPromise();
        }
      }
      
    } catch (err) {
      console.error('Order save error:', err);
      this.errorMessage = 'Failed to save your order. Please contact support.';
      throw err;
    }
  }

  private showConfirmationDrawer(transactionId: string, failedUpdates: any[]) {
    const drawer = document.createElement('div');
    drawer.className = 'offcanvas show';
    drawer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.25);
      z-index: 1050;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    const failureNotice = failedUpdates.length > 0 ? `
      <div class="alert alert-warning mt-3" role="alert">
        <p>Note: Some inventory updates failed. Our team has been notified.</p>
      </div>
    ` : '';

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
    drawer.querySelector('#closeDrawer')?.addEventListener('click', () => {
      document.body.removeChild(drawer);
    });
  }

  private handlePaymentError(err: any) {
    console.error('Payment error:', err);
    this.errorMessage = 'Payment processing error. Please try again or use a different payment method.';
    this.processingPayment = false;
    this.cdr.detectChanges();
  }

  private handlePaymentCancel() {
    console.log('Payment cancelled');
    this.processingPayment = false;
    this.cdr.detectChanges();
  }

  // Get fresh total from service
  refreshTotal(): number {
    return this.myCart.getTotal();
  }

  toggleVisibility = () => {
    this.done = !this.done;
  };
}