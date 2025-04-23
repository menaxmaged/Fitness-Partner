
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { UsersService } from '../../services/users.service';
// import { ProductServicesService } from '../../services/product-services.service';

// @Component({
//   selector: 'app-orders',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './orders.component.html',
//   styleUrl: './orders.component.css',
// })
// export class OrdersComponent implements OnInit {
//   user: any = {};
//   orders: any[] = [];
//   processedOrders: any[] = [];
  
//   constructor(
//     private userService: UsersService,
//     private productService: ProductServicesService
//   ) {}

//   ngOnInit(): void {
//     const token = localStorage.getItem('token');
//     const userId = token ? atob(token) : null;

//     if (userId) {
//       this.userService.getUserById(userId).subscribe({
//         next: (foundUser) => {
//           this.user = foundUser;
//           this.orders = this.user.orders || [];
//           this.processOrderDetails();
//         },
//         error: (err) => {
//           console.error('User not found', err);
//         },
//       });
//     } else {
//       console.error('No userId found in localStorage');
//     }
//   }

//   processOrderDetails(): void {
//     if (!this.orders || this.orders.length === 0) {
//       return;
//     }

//     // Process each order one by one
//     this.orders.forEach(order => {
//       // Create processed order with formatted date
//       const processedOrder = {
//         ...order,
//         formattedDate: new Date(order.date).toLocaleDateString(),
//         items: []
//       };
      
//       // Get product details for each productId
//       if (order.productId && order.productId.length > 0) {
//         let loadedItems = 0;
        
//         order.productId.forEach((productId: string) => {
//           this.productService.getProductById(Number(productId)).subscribe({
//             next: (product) => {
//               processedOrder.items.push(product);
//               loadedItems++;
              
//               // When all products are loaded, add to processedOrders array
//               if (loadedItems === order.productId.length) {
//                 this.processedOrders.push(processedOrder);
//               }
//             },
//             error: (err) => {
//               console.error(`Error loading product ${productId}`, err);
//               loadedItems++;
//             }
//           });
//         });
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ProductServicesService } from '../../services/product-services.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  user: any = {};
  orders: any[] = [];
  processedOrders: any[] = [];
  
  constructor(
    private userService: UsersService,
    private productService: ProductServicesService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userId = token ? atob(token) : null;

    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (foundUser) => {
          this.user = foundUser;
          this.orders = this.user.orders || [];
          this.processOrderDetails();
        },
        error: (err) => {
          console.error('User not found', err);
        },
      });
    } else {
      console.error('No userId found in localStorage');
    }
  }

  processOrderDetails(): void {
    if (!this.orders || this.orders.length === 0) {
      return;
    }

    // Process each order one by one
    this.orders.forEach(order => {
      // Create processed order with formatted date
      const processedOrder = {
        ...order,
        formattedDate: new Date(order.date).toLocaleDateString(),
        items: [],
        productQuantities: {} // Add a map to store quantities
      };
      
      // Count product quantities
      if (order.productId && order.productId.length > 0) {
        // Count occurrences of each productId
        order.productId.forEach((productId: string) => {
          if (!processedOrder.productQuantities[productId]) {
            processedOrder.productQuantities[productId] = 0;
          }
          processedOrder.productQuantities[productId]++;
        });
        
        // Get unique product IDs
        const uniqueProductIds = [...new Set(order.productId)];
        let loadedItems = 0;
        
        // Fetch details for each unique product
        uniqueProductIds.forEach((productId: any) => {
          this.productService.getProductById(Number(productId)).subscribe({
            next: (product) => {
              processedOrder.items.push(product);
              loadedItems++;
              
              // When all unique products are loaded, add to processedOrders array
              if (loadedItems === uniqueProductIds.length) {
                this.processedOrders.push(processedOrder);
              }
            },
            error: (err) => {
              console.error(`Error loading product ${productId}`, err);
              loadedItems++;
            }
          });
        });
      }
    });
  }

  // Get quantity of a specific product in an order
  getProductQuantity(order: any, productId: string): number {
    return order.productQuantities[productId] || 0;
  }

  // Get the total count of items (including quantities)
  getTotalItemCount(order: any): any {
    return Object.values(order.productQuantities)
      .reduce((sum: any, quantity: any) => sum + quantity, 0);
  }
}