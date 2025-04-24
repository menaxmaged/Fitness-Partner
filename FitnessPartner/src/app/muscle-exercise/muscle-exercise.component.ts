import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-muscle-exercise',
  imports: [CommonModule],
  templateUrl: './muscle-exercise.component.html',
  styleUrl: './muscle-exercise.component.css'
})
export class MuscleExerciseComponent implements OnInit {
  type!: string;
  muscleName!: string;
  exercises: any[] = [];
  sanitizer!: DomSanitizer;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type')!;
    this.muscleName = this.route.snapshot.paramMap.get('muscle')!;
    console.log('muscleName:', this.muscleName);
    this.http.get<any[]>(`http://localhost:3200/${this.type}`).subscribe(data => {
      const group = data.find(g => g.muscle.toLowerCase() == this.muscleName);
       console.log('group:', group);
      this.exercises = group ? group.exercises : [];
      if (group.exercises) {
        this.exercises = group.exercises.map((ex: any) => ({
          ...ex,
          safeVideoUrl: this.sanitizer.bypassSecurityTrustResourceUrl(ex.videoUrl)
        }));
    }});
  }
  goToExercise(exerciseName: string) {
    console.log('switching to exercise:', exerciseName);
    this.router.navigate([
      'exercises', 
      this.type, 
      this.muscleName, 
      exerciseName.toLowerCase().replace(/\s+/g, '-')
    ]);
  }
  
}
