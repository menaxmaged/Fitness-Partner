import { Component ,OnInit} from '@angular/core';
import {TrainersDataService} from '../../services/trainers-data.service';
import { ITrainer } from '../../models/i-trainer';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
@Component({
  selector: 'app-trainers',
  imports: [RouterLink, CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './trainers.component.html',
  styleUrl:'./trainers.component.css'
})
export class TrainersComponent implements OnInit {

  trainers: ITrainer[] = [];
  isLoading = true;
  constructor(private _trainersDataService: TrainersDataService, private router: Router) {}
  ngOnInit(): void {
    this._trainersDataService.getAllTrainers().subscribe({
      next: data =>this.trainers = data,
      error: err => this.handleLoadError(err),
      complete: ()=> {this.isLoading = false;}
    });
  }

  private handleLoadError(err: any): void {
    console.error('Error loading Trainers:', err);
    this.isLoading = false;
    this.router.navigate(['/error']);
  }
}
