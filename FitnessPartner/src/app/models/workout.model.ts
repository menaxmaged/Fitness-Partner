export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    notes?: string;
  }
  
  export interface Workout {
    _id?: string;
    day: string;  // 'push', 'pull', 'legs', 'chest', 'back', 'upper', 'lower', etc.
    muscleGroup: string;
    exercises: Exercise[];
    planType: 'push-pull-legs' | 'bro-split' | 'upper-lower';
  }