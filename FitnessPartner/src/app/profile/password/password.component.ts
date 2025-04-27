import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit {
  user: any = {};
  currentPassword: string = '';
  originalPassword: string = '';
  isEditing = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (foundUser) => {
          this.user = foundUser;
          // Use placeholder for password - real password isn't sent to frontend for security
          this.currentPassword = '••••••••'; // Placeholder
          this.originalPassword = this.currentPassword;
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    console.log('password' + this.currentPassword);
  }

  toggleEdit(): void {
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.currentPassword = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.currentPassword = this.originalPassword;
    this.showPassword = false;
  }

  savePassword(): void {
    if (!this.currentPassword) {
      this.errorMessage = 'Password cannot be empty';
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User ID not found. Please log in again.';
      return;
    }

    const passwordData = {
      password: this.currentPassword,
    };

    this.userService.updateUser(userId, passwordData).subscribe({
      next: (response) => {
        this.successMessage = 'Password updated successfully!';
        this.isEditing = false;
        this.originalPassword = '••••••••';
        this.currentPassword = this.originalPassword;
        this.showPassword = false;

        // Automatically hide the success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error updating password:', err);
        this.errorMessage = 'Failed to update password. Please try again.';
      },
    });
  }
}
