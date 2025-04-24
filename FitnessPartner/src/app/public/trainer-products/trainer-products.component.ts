import { Component, Input } from '@angular/core';
import {ITrainerProducts} from '../../models/i-trainer-products';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-trainer-products',
  imports: [CommonModule,RouterModule,RouterLink],
  templateUrl: './trainer-products.component.html',
  styleUrl: './trainer-products.component.css',
})
export class TrainerProductsComponent {
  @Input() products: ITrainerProducts[] = [];
}