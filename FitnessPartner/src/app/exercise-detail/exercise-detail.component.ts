import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-detail',
  imports: [CommonModule],
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.css'
})
export class ExerciseDetailComponent implements OnInit {
  type!: string;
  muscle!: string;
  exerciseName!: string;
  exercise: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type')!;
    this.muscle = this.route.snapshot.paramMap.get('muscle')!;
    this.exerciseName = this.route.snapshot.paramMap.get('exercise')!.replace(/-/g, ' ');

    this.http.get<any[]>(`http://localhost:3200/${this.type}`).subscribe(data => {
      const muscleGroup = data.find(group => group.muscle.toLowerCase() === this.muscle);
      this.exercise = muscleGroup?.exercises.find((e: any) =>
        e.name.toLowerCase() === this.exerciseName
      );
    });
  }
}
