import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DietAiService } from '../services/diet-ai.service';
import { MeasurementsService } from '../services/measurements.service'; // Import the new service
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // You'll need to create or import your auth service

@Component({
  selector: 'app-diet-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './diet-form.component.html',
  styleUrls: ['./diet-form.component.css'],
})
export class DietFormComponent implements OnInit {
  formData = {
    age: null,
    weight: null,
    height: null,
    waist: null,
    neck: null,
    gender: '',
    goal: '',
  };

  result: string = '';
  loading = false;
  error = '';
  userId: string;
  savingMeasurements = false;
  measurementsSaved = false;
  errorMessage: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dietService: DietAiService,
    private measurementsService: MeasurementsService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.userId = this.authService.getCurrentUserId() || '';
  }

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const el = document.getElementById(fragment);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  submit() {
    this.loading = true;
    this.result = '';
    this.error = '';
    this.measurementsSaved = false;

    this.dietService.generateDietPlan(this.formData).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        
        // Save measurements and diet plan if user is logged in
        if (this.userId) {
          this.saveMeasurements(res);
        }
      },
      error: (err) => {
        this.error = 'Failed to generate diet plan. Try again later.';
        this.loading = false;
      },
    });
  }

  saveMeasurements(dietPlan: string) {
  this.savingMeasurements = true;
  this.errorMessage = null; // Clear previous errors
  console.log(this.formData, " this is form data");

  this.measurementsService.saveMeasurements(this.userId, this.formData, dietPlan).subscribe({
    next: () => {
      this.savingMeasurements = false;
      this.measurementsSaved = true;
    },
    error: (err) => {
      this.savingMeasurements = false;
      this.measurementsSaved = false;
      this.errorMessage = err.message || 'An unexpected error occurred.';
      console.error('Error saving measurements:', err);
    }
  });
}


  viewMeasurements() {
    this.router.navigate(['/profile/measurements']);
  }
}