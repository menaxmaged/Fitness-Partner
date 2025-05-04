import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { UsersService } from '../../services/users.service';
import { forkJoin, catchError, of } from 'rxjs';

interface DashboardStat {
  title: string;
  value: number;
  icon: string;
  change: number;
  color: string;
  // Add additional fields for revenue breakdown
  includeCancelled?: boolean;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  transactionId: string;
  products: any[];
  total: number;
  date: Date;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStat[] = [];
  recentProducts: any[] = [];
  recentUsers: any[] = [];
  isLoading: boolean = true;
  orders: Order[] = [];
  
  // Add new stats for revenue breakdown
  activeRevenue: number = 0;
  cancelledRevenue: number = 0;
  totalRevenue: number = 0;
  
  constructor(
    private productService: ProductServicesService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Initialize dashboard stats with placeholder values
    this.stats = [
      { title: 'Total Products', value: 0, icon: 'box-open', change: 5.8, color: 'blue' },
      { title: 'Total Users', value: 0, icon: 'users', change: 12.7, color: 'green' },
      { title: 'Orders', value: 0, icon: 'shopping-cart', change: -2.4, color: 'red' },
      { title: 'Active Revenue', value: 0, icon: 'chart-line', change: 8.3, color: 'purple', includeCancelled: false },
      // { title: 'Total Revenue', value: 0, icon: 'chart-line', change: 6.1, color: 'teal', includeCancelled: true }
    ];

    // Use forkJoin to load multiple data sources simultaneously
    forkJoin({
      products: this.productService.getAllProducts().pipe(catchError(err => {
        console.error('Error fetching products:', err);
        return of([]);
      })),
      users: this.usersService.getAllUsers().pipe(catchError(err => {
        console.error('Error fetching users:', err);
        return of([]);
      })),
      orders: this.usersService.getAllOrders().pipe(catchError(err => {
        console.error('Error fetching orders:', err);
        return of([]);
      })),
      orderStats: this.usersService.getOrderStats().pipe(catchError(err => {
        console.error('Error fetching order stats:', err);
        return of({ totalOrders: 0, totalRevenue: 0 });
      }))
    }).subscribe({
      next: (data) => {
        console.log('Dashboard data loaded:', data); // Debug logging
        
        // Store orders for revenue calculations
        this.orders = data.orders || [];
        
        // Calculate revenue metrics
        this.calculateRevenueMetrics();
        
        // Update stats with actual values
        this.stats[0].value = data.products.length || 0;
        this.stats[1].value = data.users.length || 0;
        
        // Update with actual order stats from backend - only use total order count
        if (data.orderStats) {
          this.stats[2].value = data.orderStats.totalOrders || 0;
        } else if (this.orders.length > 0) {
          // Fallback if orderStats isn't available
          this.stats[2].value = this.orders.length;
        }
        
        // Use our calculated revenue values
        this.stats[3].value = this.activeRevenue;
        // this.stats[4].value = this.totalRevenue;
        
        // Process products data
        if (data.products && data.products.length > 0) {
          this.recentProducts = data.products
            .sort((a: any, b: any) => new Date(b.dateAdded || Date.now()).getTime() - 
                                      new Date(a.dateAdded || Date.now()).getTime())
            .slice(0, 5)
            .map((product: any) => ({
              ...product,
              inStock: product.inStock !== undefined ? product.inStock : true
            }));
        }
        
        // Process users data
        if (data.users && data.users.length > 0) {
          this.recentUsers = data.users
            .sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - 
                                      new Date(a.createdAt || Date.now()).getTime())
            .slice(0, 5)
            .map((user: any) => ({
              ...user,
              active: user.isVerified !== undefined ? user.isVerified : true
            }));
        }
          
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
      }
    });
  }
  
  // Calculate revenue metrics - excluding cancelled orders
  calculateRevenueMetrics(): void {
    if (!this.orders || this.orders.length === 0) {
      this.activeRevenue = 0;
      this.cancelledRevenue = 0;
      this.totalRevenue = 0;
      return;
    }
    
    // Active revenue (excluding cancelled orders)
    this.activeRevenue = this.orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.total, 0);
    
    // Revenue from cancelled orders
    this.cancelledRevenue = this.orders
      .filter(order => order.status === 'cancelled')
      .reduce((total, order) => total + order.total, 0);
    
    // Total revenue (including cancelled orders)
    this.totalRevenue = this.orders
      .reduce((total, order) => total + order.total, 0);
  }
  
  // Format currency values
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);
  }
}