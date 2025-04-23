import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercises-gym',
  imports: [CommonModule],
  templateUrl: './exercises-gym.component.html',
  styleUrls: ['./exercises-gym.component.css']
})
export class ExercisesGymComponent implements OnInit {
  muscles: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3200/gym').subscribe(data => {
      this.muscles = data;
    });
  }

  goToMuscle(muscle: string) {
    this.router.navigate(['/exercises/gym', muscle.toLowerCase()]);
  }
}
