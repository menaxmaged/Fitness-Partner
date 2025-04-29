import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl:'./about.component.css',
})
export class AboutComponent {
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
