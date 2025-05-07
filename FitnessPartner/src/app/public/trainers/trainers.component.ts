// import { Component, OnInit } from '@angular/core';
// import { TrainersDataService } from '../../services/trainers-data.service';
// import { ITrainer } from '../../models/i-trainer';
// import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { DietFormComponent } from "../../diet-form/diet-form.component";
// import { UpperLowerSplitComponent } from "../../workout-list/upper-lower/upper-lower.component";
// import { WorkoutsComponent } from "../../workout-list/workout-list.component";

// @Component({
//   selector: 'app-trainers',
//   imports: [
//     RouterLink,
//     CommonModule,
//     RouterModule,
//     LoadingSpinnerComponent,
//     TranslateModule,
//     WorkoutsComponent
// ],
//   templateUrl: './trainers.component.html',
//   styleUrl: './trainers.component.css',
// })
// export class TrainersComponent{
//   trainers: ITrainer[] = [];
//   isLoading = true;
//   constructor(
//     private _trainersDataService: TrainersDataService,
//     private router: Router,
//     private translate: TranslateService
//   ) {
//     this.translate.setDefaultLang('en');
//   }
//   ngOnInit(): void {
//     this._trainersDataService.getAllTrainers().subscribe({
//       next: (data) => (this.trainers = data),
//       error: (err) => this.handleLoadError(err),
//       complete: () => {
//         this.isLoading = false;
//       },
//     });
//   }

//   private handleLoadError(err: any): void {
//     console.error('Error loading Trainers:', err);
//     this.isLoading = false;
//     this.router.navigate(['/error']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { TrainersDataService } from '../../services/trainers-data.service';
import { ITrainer } from '../../models/i-trainer';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DietFormComponent } from "../../diet-form/diet-form.component";
import { UpperLowerSplitComponent } from "../../workout-list/upper-lower/upper-lower.component";
import { WorkoutsComponent } from "../../workout-list/workout-list.component";

@Component({
  selector: 'app-trainers',
  imports: [
    RouterLink,
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    TranslateModule,
    WorkoutsComponent
  ],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css',
})
export class TrainersComponent implements OnInit {
  trainers: ITrainer[] = [];
  isLoading = true;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  paginatedTrainers: ITrainer[] = [];
  
  constructor(
    private _trainersDataService: TrainersDataService,
    private router: Router,
    private activRoute:ActivatedRoute,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }
  
  ngOnInit(): void {
    this._trainersDataService.getAllTrainers().subscribe({
      next: (data) => {
        // Reverse the trainers array (last to first)
        this.trainers = data.reverse();
        this.calculateTotalPages();
        this.updatePaginatedTrainers();
      },
      error: (err) => this.handleLoadError(err),
      complete: () => {
        this.isLoading = false;
      },
    });

    this.activRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  private handleLoadError(err: any): void {
    console.error('Error loading Trainers:', err);
    this.isLoading = false;
    this.router.navigate(['/error']);
  }
  
  // Pagination methods
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.trainers.length / this.itemsPerPage);
  }
  
  updatePaginatedTrainers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.trainers.length);
    this.paginatedTrainers = this.trainers.slice(startIndex, endIndex);
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedTrainers();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTrainers();
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTrainers();
    }
  }
  
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}