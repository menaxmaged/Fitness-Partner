import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  selector: 'app-upper-lower-split',
  templateUrl: './upper-lower.component.html',
  styleUrls: ['./upper-lower.component.css']
})
export class UpperLowerSplitComponent {
  expandedSection: string = 'overview';
  expandedWorkouts: string[] = [];
  filteredWorkouts = UPPER_LOWER_WORKOUTS;

  constructor(private router: Router) {}

  toggleSection(section: string): void {
    this.expandedSection = this.expandedSection === section ? '' : section;
  }

  toggleWorkout(day: string): void {
    const index = this.expandedWorkouts.indexOf(day);
    if (index > -1) {
      this.expandedWorkouts.splice(index, 1);
    } else {
      this.expandedWorkouts.push(day);
    }
  }

  isWorkoutExpanded(day: string): boolean {
    return this.expandedWorkouts.includes(day);
  }

  navigateToExercises(muscle: string): void {
    if (muscle) {
      this.router.navigate([`/exercises/gym/${muscle}`]);
    }
  }
}

const UPPER_LOWER_WORKOUTS = [
  {
    day: 'upper-a',
    muscleGroup: 'Chest, Back, Shoulders, Arms',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', notes: 'Barbell or dumbbell' },
      { name: 'Pull-Ups', sets: 4, reps: '6-8' },
      { name: 'Overhead Press', sets: 3, reps: '8-10' },
      { name: 'Barbell Row', sets: 3, reps: '8-10' },
      { name: 'Dumbbell Flyes', sets: 3, reps: '12-15' }
    ]
  },
  {
    day: 'lower-a',
    muscleGroup: 'Legs, Core',
    exercises: [
      { name: 'Squats', sets: 4, reps: '8-10' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '8-10' },
      { name: 'Leg Press', sets: 3, reps: '10-12' },
      { name: 'Leg Curls', sets: 3, reps: '12-15' },
      { name: 'Plank', sets: 3, reps: '60s' }
    ]
  },
  {
    day: 'upper-b',
    muscleGroup: 'Back, Chest, Arms',
    exercises: [
      { name: 'Incline Bench Press', sets: 4, reps: '8-10' },
      { name: 'Lat Pulldown', sets: 4, reps: '8-10' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12' },
      { name: 'Cable Rows', sets: 3, reps: '10-12' },
      { name: 'Lateral Raises', sets: 3, reps: '15-20' }
    ]
  },
  {
    day: 'lower-b',
    muscleGroup: 'Legs, Glutes',
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '6-8' },
      { name: 'Front Squats', sets: 3, reps: '8-10' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12' },
      { name: 'Hip Thrusts', sets: 3, reps: '12-15' },
      { name: 'Calf Raises', sets: 4, reps: '15-20' }
    ]
  }
];