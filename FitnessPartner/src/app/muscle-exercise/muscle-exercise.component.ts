import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ExerciseService } from '../services/exercise.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { TranslateModule,TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-muscle-exercise',
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink,TranslateModule],
  templateUrl: './muscle-exercise.component.html',
  styleUrls: ['./muscle-exercise.component.css'],
})
export class MuscleExerciseComponent implements OnInit {
  type!: string;
  muscleName!: string;
  exercises: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type')!;
    this.muscleName = this.route.snapshot.paramMap.get('muscle')!;

    this.exerciseService
      .getExercisesByTypeAndMuscle(this.type, this.muscleName)
      .subscribe({
        next: (exercises) => {
          this.exercises = exercises.map((exercise) => ({
            ...exercise,
            safeVideoUrl: exercise.videoUrl
              ? this.sanitizer.bypassSecurityTrustResourceUrl(exercise.videoUrl)
              : null,
          }));
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
    console.error('Error fetching exercises:', err);
    this.isLoading = false;
    this.router.navigate(['/error']);
  }

  goToExercise(exerciseName: string) {
    this.router.navigate([
      'exercises',
      this.type,
      this.muscleName,
      exerciseName.toLowerCase().replace(/\s+/g, '-'),
    ]);
  }
}

// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Router } from '@angular/router';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// @Component({
//   selector: 'app-muscle-exercise',
//   imports: [CommonModule],
//   templateUrl: './muscle-exercise.component.html',
//   styleUrl: './muscle-exercise.component.css'
// })
// export class MuscleExerciseComponent implements OnInit {
//   type!: string;
//   muscleName!: string;
//   exercises: any[] = [];
//   sanitizer!: DomSanitizer;

//   constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

//   ngOnInit(): void {
//     this.type = this.route.snapshot.paramMap.get('type')!;
//     this.muscleName = this.route.snapshot.paramMap.get('muscle')!;
//     console.log('muscleName:', this.muscleName);
//     this.http.get<any[]>(`http://localhost:3200/${this.type}`).subscribe(data => {
//       const group = data.find(g => g.muscle.toLowerCase() == this.muscleName);
//        console.log('group:', group);
//       this.exercises = group ? group.exercises : [];
//       if (group.exercises) {
//         this.exercises = group.exercises.map((ex: any) => ({
//           ...ex,
//           safeVideoUrl: this.sanitizer.bypassSecurityTrustResourceUrl(ex.videoUrl)
//         }));
//     }});
//   }
//   goToExercise(exerciseName: string) {
//     console.log('switching to exercise:', exerciseName);
//     this.router.navigate([
//       'exercises',
//       this.type,
//       this.muscleName,
//       exerciseName.toLowerCase().replace(/\s+/g, '-')
//     ]);
//   }

// }
