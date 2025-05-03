import { Component } from '@angular/core';
import { ExerciseService } from '../services/exercise.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface MuscleGroup {
  muscle: string;
  exercises: {
    name: string;
    videoUrl?: string;
    imageUrl: string;
    description?: string;
    rating?: string;
  }[];
}

@Component({
  selector: 'app-warm-up',
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink, TranslateModule],
  templateUrl: './warm-up.component.html',
  styleUrls: ['./warm-up.component.css'],
})
export class WarmUpComponent {
  muscles: MuscleGroup[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private exerciseService: ExerciseService, // Inject ExerciseService
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.fetchWarmUpExercises();
  }

  fetchWarmUpExercises(): void {
    this.exerciseService.getWarmExercises().subscribe({
      next: (data) => {
        this.muscles = this.groupExercisesByMuscle(data);
      },
      error: (err) => {
        console.error('Error fetching warm-up exercises:', err);
        this.error =
          'Failed to load warm-up exercises. Please try again later.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  groupExercisesByMuscle(exercises: any[]): MuscleGroup[] {
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

  goToMuscle(muscle: string): void {
    this.router.navigate(['/exercises/warm', muscle.toLowerCase()]);
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/muscles/default.jpg';
  }
}
