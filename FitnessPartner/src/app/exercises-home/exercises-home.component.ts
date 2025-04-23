import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../services/exercise.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercises-home',
  imports: [CommonModule],
  templateUrl: './exercises-home.component.html',
  styleUrl: './exercises-home.component.css'
})

export class ExercisesHomeComponent implements OnInit {
  muscles: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3200/home').subscribe(data => {
      this.muscles = data;
    });
  }

  goToMuscle(muscle: string) {
    this.router.navigate(['/exercises/home', muscle.toLowerCase()]);
  }
}
