// password.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit {
  user: any = {};
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isEditing = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (foundUser) => {
          this.user = foundUser;
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
          this.errorMessage =
            'Failed to load user data. Please try again later.';
        },
      });
    } else {
      console.error('No userId found in localStorage');
      this.errorMessage = 'User session not found. Please log in again.';
    }
  }

  toggleEdit(): void {
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  savePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User ID not found. Please log in again.';
      return;
    }

    const passwordData = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.userService.updatePassword(userId, passwordData).subscribe({
      next: (response) => {
        this.successMessage = 'Password updated successfully!';
        this.isEditing = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error updating password:', err);
        this.errorMessage =
          err.error?.message || 'Failed to update password. Please try again.';
      },
    });
  }
}
