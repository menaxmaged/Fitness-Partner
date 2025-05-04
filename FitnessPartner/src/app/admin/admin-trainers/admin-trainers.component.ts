import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainersDataService } from '../../services/trainers-data.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-admin-trainers',
  templateUrl: './admin-trainers.component.html',
  styleUrls: ['./admin-trainers.component.css']
})
export class AdminTrainersComponent implements OnInit {
  trainers: any[] = [];
  loading = false;
  error: string | null = null;
  selectedTrainer: any = null;
  showAddModal = false;
  newTrainer: any = {
    fName: '',
    lName: '',
    gender: 'male',
    image: null
  };
  selectedFile: File | null = null;
  constructor(private trainersService: TrainersDataService, private router: Router) {}
  ngOnInit() {
    if (!localStorage.getItem('access_token')) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }
    this.loadTrainers();
  }

  loadTrainers() {
    this.loading = true;
    this.error = null;
    
    this.trainersService.getAllTrainers().pipe(
      catchError(err => {
        this.error = `Error loading trainers: ${err.message}`;
        console.error('Failed to load trainers:', err);
        return throwError(() => err);
      })
    ).subscribe({
      next: (trainers) => {
        this.trainers = trainers;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteTrainer(trainerId: string): void {
    Swal.fire({
      title: 'Delete Trainer?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.trainersService.deleteTrainer(trainerId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Trainer has been deleted.',
              timer: 2000
            });
            this.loadTrainers();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete trainer',
            });
          }
        });
      }
    });
  }

  openTrainerDetails(trainer: any): void {
    this.selectedTrainer = trainer;
    // Add detailed fetch if needed
  }

  closeTrainerDetails(): void {
    this.selectedTrainer = null;
  }

  openAddTrainerModal() {
    this.showAddModal = true;
  }

  closeAddTrainerModal() {
    this.showAddModal = false;
    this.resetNewTrainer();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  resetNewTrainer() {
    this.newTrainer = {
      fName: '',
      lName: '',
      email: '',
      mobile: '',
      password: '',
      gender: 'male',
      image: null
    };
    this.selectedFile = null;
  }

  onSubmitNewTrainer() {
    const formData = new FormData();
    
    // Append form fields
    formData.append('fName', this.newTrainer.fName);
    formData.append('lName', this.newTrainer.lName);
    formData.append('email', this.newTrainer.email);
    formData.append('mobile', this.newTrainer.mobile);
    formData.append('password', this.newTrainer.password);
    formData.append('gender', this.newTrainer.gender);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.trainersService.addTrainer(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Trainer added successfully',
          timer: 2000
        });
        this.loadTrainers();
        this.closeAddTrainerModal();
      },
      error: (err:any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add trainer: ' + err.message
        });
      }
    });
  }

}