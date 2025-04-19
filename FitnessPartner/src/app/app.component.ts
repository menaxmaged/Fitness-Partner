import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./public/navbar/navbar.component";
import { routes } from './app.routes';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NavBarComponent,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FitnessPartner';
}