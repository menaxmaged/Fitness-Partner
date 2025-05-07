import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bro-split',
  imports: [CommonModule],
  templateUrl: './bro-split.component.html',
  styleUrl: './bro-split.component.css'
})
export class BroSplitComponent {
  expandedSection: string = 'overview';
  expandedWorkouts: string[] = [];
  filteredWorkouts = BRO_WORKOUTS;

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

const BRO_WORKOUTS = [
  {
    day: 'chest',
    muscleGroup: 'Chest',
    exercises: [
      { name: 'Flat Bench Press', sets: 4, reps: '8-10', notes: 'Barbell or dumbbell' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
      { name: 'Chest Dips', sets: 3, reps: '10-15' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15' }
    ]
  },
  {
    day: 'back',
    muscleGroup: 'Back',
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '6-8' },
      { name: 'Pull-Ups', sets: 3, reps: '8-10' },
      { name: 'Bent-Over Rows', sets: 3, reps: '8-10' },
      { name: 'Lat Pulldowns', sets: 3, reps: '10-12' }
    ]
  },
  {
    day: 'shoulders',
    muscleGroup: 'Shoulders',
    exercises: [
      { name: 'Overhead Press', sets: 4, reps: '8-10' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15' },
      { name: 'Front Raises', sets: 3, reps: '12-15' },
      { name: 'Rear Delt Flyes', sets: 3, reps: '12-15' }
    ]
  },
  {
    day: 'arms',
    muscleGroup: 'Biceps & Triceps',
    exercises: [
      { name: 'Barbell Curls', sets: 3, reps: '10-12' },
      { name: 'Skull Crushers', sets: 3, reps: '10-12' },
      { name: 'Hammer Curls', sets: 3, reps: '10-12' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12-15' }
    ]
  },
  {
    day: 'legs',
    muscleGroup: 'Legs',
    exercises: [
      { name: 'Squats', sets: 4, reps: '8-10' },
      { name: 'Leg Press', sets: 3, reps: '10-12' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '8-10' },
      { name: 'Calf Raises', sets: 4, reps: '15-20' }
    ]
  }
];