import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './public/navbar/navbar.component';
import { routes } from './app.routes';
import { FooterComponent } from './public/footer/footer.component';
import * as AOS from 'aos';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { UpperLowerSplitComponent } from './workout-list/upper-lower/upper-lower.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(public router: Router, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  title = 'FitnessPartner';
  ngOnInit() {
    AOS.init();
  }

  isAuthPage(): boolean {
    const hiddenRoutes = [
      '/login',
      '/signup',
      '/forgotPassword',
      '/resetPassword',
      '/admin/dashboard',
      '/admin/products',
      '/admin/users',
      '/admin/orders',
      '/admin/trainers',
      '/admin/nutrition',
      '/admin/settings',
    ];
    return hiddenRoutes.includes(this.router.url);
  }
}
