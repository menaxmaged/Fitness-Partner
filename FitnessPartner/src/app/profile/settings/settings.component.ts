import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../shared/utils/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  imports: [CommonModule, FormsModule, TranslateModule],
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  user: User = {} as User;
  isEditing = false;
  userId!: string;
  successMessage: string = '';

  constructor(
    private usersService: UsersService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // Get current user ID from localStorage
    this.userId = localStorage.getItem('userId') || '';

    if (!this.userId || !localStorage.getItem('access_token')) {
      // this.toastr.error('Please log in to access your settings');
      this.router.navigate(['/login']);
      return;
    }

    this.usersService.getUserById(this.userId).subscribe({
      next: (userData: User) => {
        this.user = userData;
      },
      error: (error) => {
        if (error.status === 401) {
          // this.toastr.error('Session expired. Please log in again');
          this.router.navigate(['/login']);
        } else {
          // this.toastr.error('Failed to load user data');
          console.error('Error loading user data:', error);
        }
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reload user data to discard changes when cancelling
      this.loadUserData();
    }
  }

  triggerFileInput(): void {
    document.getElementById('upload-photo')?.click();
  }

  uploadPhoto(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    this.usersService.updateUser(this.userId, formData).subscribe({
      next: () => {
        // this.toastr.success('Avatar updated successfully');
        this.loadUserData(); // Reload to show new avatar
      },
      error: (error) => {
        this.handleApiError(error, 'Failed to update avatar');
      },
    });
  }

  deleteAvatar(): void {
    const userData = { avatar: null };

    this.usersService.updateUser(this.userId, userData).subscribe({
      next: () => {
        // this.toastr.success('Avatar deleted successfully');
        this.user.avatar = undefined;
      },
      error: (error) => {
        this.handleApiError(error, 'Failed to delete avatar');
      },
    });
  }

  saveChanges(): void {
    if (!this.isEditing) return;

    const userData = {
      fName: this.user.fName,
      lName: this.user.lName,
      email: this.user.email,
      mobile: this.user.mobile || '01xxxxxxxxx',
      gender: this.user.gender,
    };

    this.usersService.updateUser(this.userId, userData).subscribe({
      next: () => {
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully!';
        // Clear the message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.handleApiError(error, 'Failed to update profile');
      },
    });
  }

  // Helper method to handle API errors consistently
  private handleApiError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);

    if (error.status === 401) {
      // this.toastr.error('Session expired. Please log in again');
      this.router.navigate(['/login']);
    } else {
      // this.toastr.error(defaultMessage);
    }
  }
}
