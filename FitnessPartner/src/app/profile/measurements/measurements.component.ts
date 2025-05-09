import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementsService, UserMeasurement } from '../../services/measurements.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [CommonModule, TranslateModule,RouterModule],
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css']
})
export class MeasurementsComponent implements OnInit {
  userId: string;
  measurements: UserMeasurement[] = [];
  loading = false;
  error = '';
  selectedMeasurement: UserMeasurement | null = null;

  constructor(
    private measurementsService: MeasurementsService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.setDefaultLang('en');
    this.userId = this.authService.getCurrentUserId() || '';
  }

  ngOnInit(): void {
    this.loadMeasurements();
  }

  loadMeasurements(): void {
    this.loading = true;
    this.error = '';

    this.measurementsService.getUserMeasurements(this.userId).subscribe({
      next: (data) => {
        this.measurements = data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.loading = false;
        
        // Select the most recent measurement by default
        if (this.measurements.length > 0) {
          this.selectMeasurement(this.measurements[0]);
        }
      },
      error: (err) => {
        this.error = 'Failed to load measurements. Please try again later.';
        this.loading = false;
        console.error('Error loading measurements:', err);
      }
    });
  }

  selectMeasurement(measurement: UserMeasurement): void {
    this.selectedMeasurement = measurement;
  }

  deleteMeasurement(id: string, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this measurement record?')) {
      this.measurementsService.deleteMeasurement(this.userId, id).subscribe({
        next: () => {
          this.measurements = this.measurements.filter(m => m.id !== id);
          
          if (this.selectedMeasurement && this.selectedMeasurement.id === id) {
            this.selectedMeasurement = this.measurements.length > 0 ? this.measurements[0] : null;
          }
        },
        error: (err) => {
          console.error('Error deleting measurement:', err);
          this.error = 'Failed to delete measurement. Please try again.';
        }
      });
    }
  }

  getDate(dateString: string | Date): Date {
    return new Date(dateString);
  }

  goToNewDietPlan(): void {
    this.router.navigate(['/nutrition']);
  }
}