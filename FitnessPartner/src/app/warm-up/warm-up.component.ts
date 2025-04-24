
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MuscleGroup {
  muscle: string;
  exercises: {
    name: string;
    videoUrl?: string;
    imageUrl: string;
    description?: string;
    rating?: string;
  }[];
}

@Component({
  selector: 'app-warm-up',
  imports: [CommonModule],
  templateUrl: './warm-up.component.html',
  styleUrl: './warm-up.component.css'
})
export class WarmUpComponent {
  muscles: MuscleGroup[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3200/warm').subscribe({
      next: (data) => {
        console.log('Received data:', data);
        this.muscles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err); 
        this.error = 'Failed to load warm-up exercises';
        this.isLoading = false;
      }
    });
  }

  fetchWarmUpExercises(): void {
    this.http.get<MuscleGroup[]>('http://localhost:3200/warm').subscribe({
      next: (data) => {
        this.muscles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching warm-up exercises:', err);
        this.error = 'Failed to load warm-up exercises. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  goToMuscle(muscle: string): void {
    this.router.navigate(['/exercises/warm', muscle.toLowerCase()]);
  }
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/muscles/default.jpg';
  }
  
}