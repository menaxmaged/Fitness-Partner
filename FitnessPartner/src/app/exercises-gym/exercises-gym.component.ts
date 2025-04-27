import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../services/exercise.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercises-gym',
  imports: [CommonModule],
  templateUrl: './exercises-gym.component.html',
  styleUrls: ['./exercises-gym.component.css']
})
export class ExercisesGymComponent implements OnInit {
  muscles: any[] = [];
  
  constructor(
    private exerciseService: ExerciseService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.exerciseService.getGymExercises().subscribe(data => {
      this.muscles = this.groupExercisesByMuscle(data);
    });
  }

  groupExercisesByMuscle(exercises: any[]): any[] {
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

  goToMuscle(muscle: string) {
    this.router.navigate(['/exercises/gym', muscle.toLowerCase()]);
  }
}