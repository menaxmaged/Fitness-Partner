// import { Component, OnInit } from '@angular/core';
// import { UsersService } from '../../services/users.service';
// import { AuthService } from '../../services/auth.service';
// import { ProductServicesService } from '../../services/product-services.service';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   imports: [CommonModule, RouterModule],
//   selector: 'app-orders',
//   templateUrl: './orders.component.html',
//   styleUrls: ['./orders.component.css']
// })
// export class OrdersComponent implements OnInit {
//   processedOrders: any[] = [];
//   isLoading: boolean = true;
//   errorMessage: string = '';

//   constructor(
//     private usersService: UsersService,
//     private authService: AuthService,
//     private ProductServicesService: ProductServicesService
//   ) {}

//   ngOnInit(): void {
//     this.loadOrders();
//   }

//   private async loadOrders(): Promise<void> {
//     const userId = this.authService.getCurrentUserId();
    
//     if (!userId) {
//       this.errorMessage = 'Please login to view your orders';
//       this.isLoading = false;
//       return;
//     }

//     try {
//       const userData: any = await this.usersService.getUserById(userId).toPromise();
//       const orders = userData.orders || [];
      
//       // Process orders with product details
//       this.processedOrders = await Promise.all(
//         orders.map(async (order: any) => ({
//           ...order,
//           formattedDate: this.formatDate(order.date),
//           items: await this.getOrderItems(order.products)
//         }))
//       );
      
//     } catch (err) {
//       console.error('Error loading orders:', err);
//       this.errorMessage = 'Failed to load order history';
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   private async getOrderItems(products: any[]): Promise<any[]> {
//     // Fetch product details for each product in the order
//     return Promise.all(products.map(async (product: any) => {
//       const productDetails = await this.ProductServicesService.getProductById(product.productId).toPromise();
//       return {
//         ...productDetails,
//         quantity: product.quantity
//       };
//     }));
//   }

//   getProductQuantity(order: any, productId: string): number {
//     const product = order.products.find((p: any) => p.productId === productId);
//     return product ? product.quantity : 0;
//   }

//   getTotalItemCount(order: any): number {
//     return order.products.reduce((sum: number, product: any) => sum + product.quantity, 0);
//   }

//   formatDate(dateString: string): string {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { ProductServicesService } from '../../services/product-services.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  processedOrders: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private ProductServicesService: ProductServicesService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private async loadOrders(): Promise<void> {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      this.errorMessage = 'Please login to view your orders';
      this.isLoading = false;
      return;
    }

    try {
      const userData: any = await this.usersService.getUserById(userId).toPromise();
      const orders = userData.orders || [];
      
      this.processedOrders = await Promise.all(
        orders.map(async (order: any) => ({
          ...order,showDetails: true,
          formattedDate: this.formatDate(order.date),
          items: await this.getOrderItems(order.products),
          address: order.address || this.getDefaultAddress() 
        }))
      );
      
    } catch (err) {
      console.error('Error loading orders:', err);
      this.errorMessage = 'Failed to load order history';
    } finally {
      this.isLoading = false;
    }
  }

  private async getOrderItems(products: any[]): Promise<any[]> {
    return Promise.all(products.map(async (product: any) => {
      const productDetails = await this.ProductServicesService.getProductById(product.productId).toPromise();
      return {
        ...productDetails,
        id: product.productId,
        quantity: product.quantity,
        selectedFlavor: product.flavor || 'Unflavored', // Map database's 'flavor' to 'selectedFlavor'
        total: productDetails ? (productDetails.price * product.quantity).toFixed(2) : '0.00'
      };
    }));
  }
  
  getProductQuantity(order: any, productId: string, flavor: string): number {
    const product = order.products.find((p: any) => 
      p.productId === productId && p.flavor === flavor
    );
    return product ? product.quantity : 0;
  }

  getTotalItemCount(order: any): number {
    return order.products.reduce((sum: number, product: any) => sum + product.quantity, 0);
  }

  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  cartTotal(){
    return this.cart.getTotal();
  }
  toggleDetails(order: any): void {
    order.showDetails = !order.showDetails;
  }
  private getDefaultAddress() {
    return {
      street: 'Address not available',
      city: 'N/A',
      state: 'N/A',
      zipCode: 'N/A',
      country: 'N/A'
    };
  }
}