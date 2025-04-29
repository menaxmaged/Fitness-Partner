import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../interfaces/auth-response.interface';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  message = '';
  isSuccess = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  get email() {
    return this.forgotForm.get('email');
  }

  onSubmit(): void {
    if (!this.forgotForm.valid) return;

    this.isLoading = true;
    this.authService.forgotPassword(this.email?.value as string).subscribe({
      next: (response: AuthResponse) => {
        this.isSuccess = true;
        this.message = response.message;
        this.isLoading = false;

        // Clear the message after 5 seconds
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: (err) => {
        this.isSuccess = false;
        this.message = err.error?.message || 'Failed to send reset link';
        this.isLoading = false;

        // Clear the message after 5 seconds
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
    });
  }
}
