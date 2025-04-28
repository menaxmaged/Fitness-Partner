import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  resetForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator.bind(this) as ValidatorFn }
  );

  token = '';
  email = '';
  message = '';
  isSuccess = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
    });
  }

  get password() {
    return this.resetForm.get('password');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  passwordMatchValidator(
    control: FormGroup
  ): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (!this.resetForm.valid || !this.token || !this.email) return;

    this.isLoading = true;
    this.authService
      .resetPassword({
        token: this.token,
        email: this.email,
        password: this.password?.value as string,
        confirmPassword: this.confirmPassword?.value as string,
      })
      .subscribe({
        next: () => {
          this.isSuccess = true;
          this.message = 'Password reset successfully!';
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.isSuccess = false;
          this.message = err.error?.message || 'Failed to reset password';
          this.isLoading = false;
        },
      });
  }
}
