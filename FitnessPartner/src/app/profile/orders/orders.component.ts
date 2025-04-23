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
  styleUrl: './orders.component.css'
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
        next: (user: any) => {  
          this.user = user;
          this.orders = user.orders || [];
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

    this.orders.forEach((order: any) => { 
      const processedOrder = {
        ...order,
        formattedDate: new Date(order.date).toLocaleDateString(),
        items: [] as any[],
        productQuantities: {} as {[key: string]: number}
      };
      
      if (order.products && order.products.length > 0) {
        order.products.forEach((product: any) => {
          processedOrder.productQuantities[product.id] = product.quantity;
        });
        
        let loadedItems = 0;
        order.products.forEach((product: any) => {
          this.productService.getProductById(Number(product.id)).subscribe({
            next: (productDetails: any) => {
              processedOrder.items.push({
                ...productDetails,
                quantity: product.quantity
              });
              loadedItems++;
              
              if (loadedItems === order.products.length) {
                this.processedOrders.push(processedOrder);
              }
            },
            error: (err) => {
              console.error(`Error loading product ${product.id}`, err);
              loadedItems++;
            }
          });
        });
      }
    });
  }

  getProductQuantity(order: any, productId: any): number {
    const idString = productId.toString();
    return order.productQuantities[idString] || 0;
  }

  getTotalItemCount(order: any): number {
    if (!order.products) return 0;
    return order.products.reduce((sum: number, product: any) => sum + product.quantity, 0);
  }
}