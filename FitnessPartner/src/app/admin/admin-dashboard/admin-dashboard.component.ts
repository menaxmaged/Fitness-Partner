import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { UsersService } from '../../services/users.service';
import { forkJoin } from 'rxjs';

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
  styleUrls: ['./admin-dashboard.component.scss']
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
      products: this.productService.getAllProducts(),
      users: this.usersService.getAllUsers()
      // Add more API calls as needed (orders, etc.)
    }).subscribe({
      next: (data) => {
        // Update stats with actual values
        this.stats[0].value = data.products.length;
        this.stats[1].value = data.users.length;
        // For demo purposes - in real app, get from actual services
        this.stats[2].value = Math.floor(Math.random() * 50) + 10; // Random orders count
        this.stats[3].value = Math.floor(Math.random() * 10000) + 1000; // Random revenue
        
        // Get recent products (last 5)
        this.recentProducts = data.products
          .sort((a: any, b: any) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime())
          .slice(0, 5);
          
        // Get recent users (last 5)
        this.recentUsers = data.users
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5);
          
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
      }
    });
  }
}