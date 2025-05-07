import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrainersDataService } from '../../services/trainers-data.service';
import { ITrainer } from '../../models/i-trainer';
import { ITrainerProducts } from '../../models/i-trainer-products';
import { CommonModule } from '@angular/common';
import { TrainerFAQComponent } from '../trainer-faq/trainer-faq.component';
import { TrainerProductsComponent } from '../trainer-products/trainer-products.component';
import { ProductServicesService } from '../../services/product-services.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trainer-details',
  imports: [
    TranslateModule,
    RouterLink,
    CommonModule,
    TrainerFAQComponent,
    TrainerProductsComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './trainer-details.component.html',
  styles: ``,
})
export class TrainerDetailsComponent implements OnInit {
  trainerId!: number;
  trainer!: ITrainer | undefined;
  products: ITrainerProducts[] = [];

  constructor(
    private route: ActivatedRoute,
    private trainerService: TrainersDataService,
    private productService: ProductServicesService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.trainerId = Number(params.get('id'));
      console.log('Trainer ID:', this.trainerId);
      this.getTrainerDetails();
    });
  }

  getTrainerDetails() {
    this.trainerService.getTrainerById(this.trainerId.toString()).subscribe((data) => {
      console.log('Trainer Data:', data);
      this.trainer = data;

      if (this.trainer?.products && this.trainer.products.length > 0) {
        for (let productRef of this.trainer.products) {
          this.productService
            .getProductById(productRef.id)
            .subscribe((product) => {
              this.products.push(product);
              console.log(this.products);
            });
        }
      }
    });
  }
}
