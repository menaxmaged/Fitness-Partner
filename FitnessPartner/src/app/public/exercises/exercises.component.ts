import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-exercises',
  imports: [],
  templateUrl: './exercises.component.html',
  styles: ``
})
export class ExercisesComponent {
  constructor(private router: Router) {}

  navigateTo(type: string) {
    this.router.navigate([`/exercises/${type}`]);
  }
  
}
