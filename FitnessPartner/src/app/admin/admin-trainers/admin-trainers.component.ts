import { Component, OnInit } from '@angular/core';
import { TrainersDataService } from '../../services/trainers-data.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports:[CommonModule,FormsModule],
  selector: 'app-admin-trainers',
  templateUrl: './admin-trainers.component.html',
  styleUrls: ['./admin-trainers.component.css']
})
export class AdminTrainersComponent implements OnInit {
  trainers: any[] = [];
  showAddTrainerModal = false;
  showEditTrainerModal = false;
  
  // For new trainer
  newTrainer = {
    name: '',
    bio: '',
    image: null
  };
  selectedFile: File | null = null;
  
  // For editing existing trainer
  currentTrainer: any = null;
  editTrainerData: { name: string; bio: string; faq: any[]; products: any[] } = {
    name: '',
    bio: '',
    faq: [],
    products: []
  };
  editSelectedFile: File | null = null;
  
  // For FAQs
  newQuestion = '';
  newAnswer = '';
  
  // For Products
  newProductId = '';
  
  constructor(private trainersService: TrainersDataService) { }

  ngOnInit(): void {
    this.loadTrainers();
  }

  loadTrainers(): void {
    this.trainersService.getAllTrainers().subscribe({
      next: (data) => {
        this.trainers = data;
        console.log('Loaded trainers:', this.trainers);
      },
      error: (err) => {
        console.error('Error loading trainers:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load trainers'
        });
      }
    });
  }

  openAddTrainerModal(): void {
    this.resetNewTrainer();
    this.showAddTrainerModal = true;
  }

  closeAddTrainerModal(): void {
    this.showAddTrainerModal = false;
  }

  openEditTrainerModal(trainer: any): void {
    this.currentTrainer = trainer;
    this.editTrainerData = {
      name: trainer.name,
      bio: trainer.bio,
      faq: Array.isArray(trainer.faq) ? [...trainer.faq] : [], // Create a copy to avoid direct modification
      products: Array.isArray(trainer.products) ? [...trainer.products] : [] // Create a copy to avoid direct modification
    };
    this.editSelectedFile = null;
    this.showEditTrainerModal = true;
  }

  closeEditTrainerModal(): void {
    this.showEditTrainerModal = false;
    this.currentTrainer = null;
  }

  resetNewTrainer(): void {
    this.newTrainer = {
      name: '',
      bio: '',
      image: null
    };
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onEditFileSelected(event: any): void {
    this.editSelectedFile = event.target.files[0];
  }

  onSubmitNewTrainer(): void {
    const formData = new FormData();

    // Append only the necessary form fields
    formData.append('name', this.newTrainer.name);
    formData.append('bio', this.newTrainer.bio || '');

    // Add the image if one was selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    console.log('Submitting form data:', this.newTrainer);
    
    this.trainersService.addTrainer(formData).subscribe({
      next: (response) => {
        console.log('Trainer added:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Trainer added successfully',
          timer: 2000
        });
        this.loadTrainers();
        this.closeAddTrainerModal();
      },
      error: (err) => {
        console.error('Failed to add trainer:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add trainer: ' + (err.message || 'Unknown error')
        });
      }
    });
  }

  onSubmitEditTrainer(): void {
    if (!this.currentTrainer) return;

    // Check if we have a new image
    if (this.editSelectedFile) {
      // Use FormData for image updates
      const formData = new FormData();
      formData.append('name', this.editTrainerData.name);
      formData.append('bio', this.editTrainerData.bio || '');
      formData.append('image', this.editSelectedFile);
      
      // Add the FAQ data if it exists
      if (this.editTrainerData.faq && this.editTrainerData.faq.length > 0) {
        formData.append('faq', JSON.stringify(this.editTrainerData.faq));
      }
      
      // Add the products data if it exists
      if (this.editTrainerData.products && this.editTrainerData.products.length > 0) {
        formData.append('products', JSON.stringify(this.editTrainerData.products));
      }

      this.trainersService.updateTrainerWithImage(this.currentTrainer.id, formData).subscribe({
        next: this.handleUpdateSuccess.bind(this),
        error: this.handleUpdateError.bind(this)
      });
    } else {
      // Use regular JSON for updates without image
      const updateData = {
        name: this.editTrainerData.name,
        bio: this.editTrainerData.bio,
        faq: this.editTrainerData.faq,
        products: this.editTrainerData.products
      };

      this.trainersService.updateTrainer(this.currentTrainer.id, updateData).subscribe({
        next: this.handleUpdateSuccess.bind(this),
        error: this.handleUpdateError.bind(this)
      });
    }
  }

  handleUpdateSuccess(response: any): void {
    console.log('Trainer updated:', response);
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Trainer updated successfully',
      timer: 2000
    });
    this.loadTrainers();
    this.closeEditTrainerModal();
  }

  handleUpdateError(err: any): void {
    console.error('Failed to update trainer:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update trainer: ' + (err.message || 'Unknown error')
    });
  }

  deleteTrainer(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this trainer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Deleting trainer with ID: ${id}`);
        this.trainersService.deleteTrainer(id).subscribe({
          next: () => {
            console.log(`Trainer ${id} deleted successfully`);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Trainer has been deleted.',
              timer: 2000
            });
            this.loadTrainers();
          },
          error: (err) => {
            console.error('Error deleting trainer:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete trainer: ' + (err.message || 'Unknown error')
            });
          }
        });
      }
    });
  }

  // FAQ Management
  addFaq(): void {
    if (this.newQuestion && this.newAnswer) {
      this.editTrainerData.faq.push({
        question: this.newQuestion,
        answer: this.newAnswer
      });
      this.newQuestion = '';
      this.newAnswer = '';
    }
  }

  removeFaq(index: number): void {
    this.editTrainerData.faq.splice(index, 1);
  }

  // Product Management
  addProduct(): void {
    if (this.newProductId && this.newProductId.trim() !== '') {
      // Check if product already exists in the list
      const exists = this.editTrainerData.products.some(p => p.id.toString() === this.newProductId.toString());
      
      if (!exists) {
        this.editTrainerData.products.push({
          id: this.newProductId
        });
        this.newProductId = '';
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'This product is already associated with this trainer'
        });
      }
    }
  }

  removeProduct(index: number): void {
    this.editTrainerData.products.splice(index, 1);
  }
}