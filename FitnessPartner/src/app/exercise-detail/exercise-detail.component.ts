// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import e from 'express';

// @Component({
//   selector: 'app-exercise-detail',
//   imports: [CommonModule],
//   templateUrl: './exercise-detail.component.html',
//   styleUrl: './exercise-detail.component.css'
// })

// export class ExerciseDetailComponent implements OnInit {
//   type!: string;
//   muscle!: string;
//   exerciseName!: string;
//   exercise: any;

//   constructor(private route: ActivatedRoute, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.type = this.route.snapshot.paramMap.get('type')!; console.log('type:', this.type);
//     this.muscle = this.route.snapshot.paramMap.get('muscle')!;
//     this.exerciseName = this.route.snapshot.paramMap.get('exercise')!.replace(/-/g, ' ');

//     this.http.get<any[]>(`http://localhost:3200/${this.type}`).subscribe(data => {
//       const muscleGroup = data.find(group => group.muscle.toLowerCase() == this.muscle); console.log('muscle:', muscleGroup.muscle);
//       this.exercise = muscleGroup?.exercises.find((e: any) =>
//         e.name.toLowerCase() == this.exerciseName
//       );

//     });
//   }

// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExerciseService } from '../services/exercise.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { TranslateModule,TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-exercise-detail',
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink,TranslateModule],
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.css',
})
export class ExerciseDetailComponent implements OnInit {
  exercise: any = {};
  muscle: string = '';
  type: string = '';
  error: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private translate: TranslateService
    ) {
      this.translate.setDefaultLang('en');
    }

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    const muscleParam = this.route.snapshot.paramMap.get('muscle');
    const exerciseParam = this.route.snapshot.paramMap.get('exercise');
    console.log(
      'type:',
      type,
      'muscle:',
      muscleParam,
      'exercise:',
      exerciseParam
    );

    if (type && muscleParam && exerciseParam) {
      // const muscle = this.capitalizeFirstLetter(muscleParam);
      const muscle = this.capitalizeWords(muscleParam);

      const exerciseName = this.formatExerciseName(exerciseParam);
      this.type = type;
      this.muscle = muscle;

      this.exerciseService
        .getExerciseDetails(type, muscle, exerciseName)
        .subscribe({
          next: (data) => {
            this.exercise = data;
            this.muscle = muscle;
            this.type = type;
          },
          error: (err) => this.handleLoadError(err),
          complete: () => {
            this.isLoading = false;
          },
        });

      // this.exerciseService.getExerciseDetails(type, muscle, exerciseName).subscribe({
      //   next: (data) => {
      //     if (data) {
      //       this.exercise = data;
      //     } else {
      //       this.error = 'Exercise not found';
      //       console.error('Exercise not found:', exerciseName);
      //     }
      //     this.isLoading = false;
      //   },
      //   error: (err) => {
      //     this.error = 'Failed to load exercise details';
      //     console.error('Error fetching exercise details:', err);
      //     this.isLoading = false;
      //   }
      // });
    }
  }

  private handleLoadError(err: any): void {
    console.error('Error loading Exercise:', err);
    this.isLoading = false;
    this.router.navigate(['/error']);
  }
  // capitalizeFirstLetter(text: string): string {
  //   if (!text) return '';
  //   return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  // }

  capitalizeWords(text: string): string {
    if (!text) return '';
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  formatExerciseName(slug: string): string {
    if (!slug) return '';

    let formatted = decodeURIComponent(slug);
    formatted = formatted.replace(/-/g, ' ');
    formatted = formatted
      .split(' ')
      .map((word) => this.capitalizeWords(word))
      .join(' ');

    return formatted.trim();
  }
}
