import { Component } from '@angular/core';
import { ExerciseService } from '../services/exercise.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './warm-up.component.html',
  styleUrls: ['./warm-up.component.css']
})
export class WarmUpComponent {
  muscles: MuscleGroup[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private exerciseService: ExerciseService, // Inject ExerciseService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchWarmUpExercises();
  }

  fetchWarmUpExercises(): void {
    this.exerciseService.getWarmExercises().subscribe({
      next: (data) => {
        this.muscles = this.groupExercisesByMuscle(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching warm-up exercises:', err);
        this.error = 'Failed to load warm-up exercises. Please try again later.';
        this.isLoading = false;
      }
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

    return Object.keys(grouped).map(muscle => ({
      muscle,
      exercises: grouped[muscle]
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