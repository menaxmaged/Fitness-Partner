import { Component, OnInit } from '@angular/core';
import { TrainersDataService } from '../../services/trainers-data.service';
import { ITrainer } from '../../models/i-trainer';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DietFormComponent } from "../../diet-form/diet-form.component";
import { WorkoutsComponent } from "../../workout-list/workout-list.component";
import { UpperLowerSplitComponent } from "../../workout-list/upper-lower/upper-lower.component";

@Component({
  selector: 'app-trainers',
  imports: [
    RouterLink,
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    TranslateModule,
    DietFormComponent,
    WorkoutsComponent,
  ],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css',
})
export class TrainersComponent{
  trainers: ITrainer[] = [];
  isLoading = true;
  constructor(
    private _trainersDataService: TrainersDataService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }
  ngOnInit(): void {
    this._trainersDataService.getAllTrainers().subscribe({
      next: (data) => (this.trainers = data),
      error: (err) => this.handleLoadError(err),
      complete: () => {
        this.isLoading = false;
      },
    });

      // this.route.fragment.subscribe(fragment => {
      //   if (fragment) {
      //     const el = document.getElementById(fragment);
      //     if (el) {
      //       el.scrollIntoView({ behavior: 'smooth' });
      //     }
      //   }
      // });
  }

  private handleLoadError(err: any): void {
    console.error('Error loading Trainers:', err);
    this.isLoading = false;
    this.router.navigate(['/error']);
  }
}
