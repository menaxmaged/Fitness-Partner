import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent implements OnInit {
  activeSectionTitle: string = 'Dashboard';
  showProfileMenu: boolean = false;
  searchQuery: string = '';
  Math = Math;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isAdmin();
    // Update the active section title whenever the route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const url = this.router.url;
          if (url.includes('/admin/products')) return 'Products';
          if (url.includes('/admin/users')) return 'Users';
          if (url.includes('/admin/orders')) return 'Orders';
          if (url.includes('/admin/trainers')) return 'Trainers';
          if (url.includes('/admin/nutrition')) return 'Nutrition';
          if (url.includes('/admin/settings')) return 'Settings';
          return 'Dashboard';
        })
      )
      .subscribe((title) => {
        this.activeSectionTitle = title;
      });
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    // Emit search event or handle search logic
    // This can be implemented based on your search requirements
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
