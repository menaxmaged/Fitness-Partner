import { Component ,OnInit} from '@angular/core';
import {TrainersDataService} from '../../services/trainers-data.service';
import { ITrainer } from '../../models/i-trainer';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-trainers',
  imports: [RouterLink,CommonModule,RouterModule],
  templateUrl: './trainers.component.html',
  styles: ``
})
export class TrainersComponent implements OnInit {
  trainers: ITrainer[] = [];
  constructor(private _trainersDataService: TrainersDataService) {}
  ngOnInit(): void {
    this._trainersDataService.getAllTrainers().subscribe((data) => {
      this.trainers = data;
    });
  }
}
