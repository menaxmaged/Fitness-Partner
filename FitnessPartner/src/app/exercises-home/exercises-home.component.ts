import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../services/exercise.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from "../shared/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-exercises-home',
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './exercises-home.component.html',
  styleUrl: './exercises-home.component.css'
})

export class ExercisesHomeComponent implements OnInit {
  muscles: any[] = [];
  isLoading:boolean = true;
  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  // constructor(private http: HttpClient, private router: Router) {}

  // ngOnInit(): void {
  //   this.http.get<any[]>('http://localhost:3200/home').subscribe(data => {
  //     this.muscles = data;
  //   });
  // }
  ngOnInit(): void {
    
    this.exerciseService.getHomeExercises().subscribe({
      next: data=>{this.muscles = this.groupExercisesByMuscle(data);},
      error: err=> {this.handleLoadError(err);},
      complete: ()=> {this.isLoading = false;}
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
    return Object.keys(grouped).map(muscle => ({
      muscle,
      exercises: grouped[muscle]
    }));
  }


  goToMuscle(muscle: string) {
    console.log('switching to muscle:', muscle);
    this.router.navigate(['/exercises/home', muscle.toLowerCase()]);
  }
  
}
