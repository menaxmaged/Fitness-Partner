import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { Router, Event,RouterLink, RouterModule, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule,RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isLoading = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event:Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading = false;
      }
    });
  }
  
}
