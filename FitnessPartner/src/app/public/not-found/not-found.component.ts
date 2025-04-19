import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styles: ``
})
export class NotFoundComponent {
  constructor(private router: Router) {}
  goHome() {
    this.router.navigate(['/']);
  }
}
