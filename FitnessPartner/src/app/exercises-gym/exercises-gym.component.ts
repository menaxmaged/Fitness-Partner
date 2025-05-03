import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../services/exercise.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-exercises-gym',
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink, TranslateModule],
  templateUrl: './exercises-gym.component.html',
  styleUrls: ['./exercises-gym.component.css'],
})
export class ExercisesGymComponent implements OnInit {
  muscles: any[] = [];
  isLoading: boolean = true;
  constructor(
    private exerciseService: ExerciseService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.exerciseService.getGymExercises().subscribe({
      next: (data) => {
        this.muscles = this.groupExercisesByMuscle(data);
      },
      error: (err) => {
        this.handleLoadError(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private handleLoadError(err: any): void {
    console.error('Error loading Exercises:', err);
    this.isLoading = false;
    this.router.navigate(['/error']);
  }

  groupExercisesByMuscle(exercises: any[]): any[] {
    const grouped: { [muscle: string]: any[] } = {};

    for (const exercise of exercises) {
      if (!grouped[exercise.muscle]) {
        grouped[exercise.muscle] = [];
      }
      grouped[exercise.muscle].push(exercise);
    }
    return Object.keys(grouped).map((muscle) => ({
      muscle,
      exercises: grouped[muscle],
    }));
  }

  goToMuscle(muscle: string) {
    this.router.navigate(['/exercises/gym', muscle.toLowerCase()]);
  }
}
