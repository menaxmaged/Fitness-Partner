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
      { title: 'Revenue', value: 0, icon: 'dollar-sign', change: 8.3, color: 'purple' }
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
      orderStats: this.usersService.getOrderStats().pipe(catchError(err => {
        console.error('Error fetching order stats:', err);
        return of({ totalOrders: 0, totalRevenue: 0 });
      }))
    }).subscribe({
      next: (data) => {
        console.log('Dashboard data loaded:', data); // Debug logging
        
        // Update stats with actual values
        this.stats[0].value = data.products.length || 0;
        this.stats[1].value = data.users.length || 0;
        
        // Update with actual order stats from backend
        if (data.orderStats) {
          this.stats[2].value = data.orderStats.totalOrders || 0;
          this.stats[3].value = data.orderStats.totalRevenue || 0;
        }
        
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
}