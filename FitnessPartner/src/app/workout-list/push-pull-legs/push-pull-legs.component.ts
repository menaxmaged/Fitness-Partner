import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  imports:[CommonModule],
  selector: 'app-push-pull-legs',
  templateUrl: './push-pull-legs.component.html',
  styleUrls: ['./push-pull-legs.component.css']
})
export class PushPullLegsComponent implements OnInit {
  expandedSection: string | null = 'overview';
  expandedWorkouts: string[] = []; // Track expanded workout days
  filteredWorkouts = WORKOUTS;
  
  constructor() { }
  
  ngOnInit(): void {
    // Initially expand all workouts
    this.filteredWorkouts.forEach(workout => {
      this.expandedWorkouts.push(workout.day);
    });
  }
  
  toggleSection(section: string): void {
    this.expandedSection = this.expandedSection === section ? null : section;
  }
  
  isExpanded(section: string): boolean {
    return this.expandedSection === section;
  }
  
  toggleWorkout(day: string): void {
    const index = this.expandedWorkouts.indexOf(day);
    if (index > -1) {
      this.expandedWorkouts.splice(index, 1); // Remove from expanded list
    } else {
      this.expandedWorkouts.push(day); // Add to expanded list
    }
  }
  
  isWorkoutExpanded(day: string): boolean {
    return this.expandedWorkouts.includes(day);
  }
}

// Sample workout data
const WORKOUTS = [
  {
    day: 'push',
    muscleGroup: 'Chest, Shoulders, Triceps',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', notes: 'Focus on chest contraction' },
      { name: 'Overhead Press', sets: 3, reps: '8-10', notes: 'Keep core tight' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', notes: null },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', notes: 'Controlled movement' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '10-12', notes: null },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', notes: null }
    ]
  },
  {
    day: 'pull',
    muscleGroup: 'Back, Biceps, Rear Delts',
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '6-8', notes: 'Focus on form' },
      { name: 'Pull-Ups/Lat Pulldowns', sets: 3, reps: '8-10', notes: null },
      { name: 'Barbell Rows', sets: 3, reps: '8-10', notes: 'Keep back straight' },
      { name: 'Face Pulls', sets: 3, reps: '12-15', notes: 'For rear delts and rotator cuff' },
      { name: 'Bicep Curls', sets: 3, reps: '10-12', notes: null },
      { name: 'Hammer Curls', sets: 3, reps: '10-12', notes: 'Works brachialis and forearms' }
    ]
  },
  {
    day: 'legs',
    muscleGroup: 'Quads, Hamstrings, Calves, Core',
    exercises: [
      { name: 'Squats', sets: 4, reps: '8-10', notes: 'Focus on depth and form' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '8-10', notes: 'Focus on hamstrings' },
      { name: 'Leg Press', sets: 3, reps: '10-12', notes: null },
      { name: 'Walking Lunges', sets: 3, reps: '10-12 each leg', notes: null },
      { name: 'Calf Raises', sets: 4, reps: '15-20', notes: null },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', notes: 'For core' }
    ]
  }
];