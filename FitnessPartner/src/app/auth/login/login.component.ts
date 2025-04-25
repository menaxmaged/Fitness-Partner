import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  usersData: any[] = [];

  constructor(
    private myUserService: UsersService,
    private router: Router,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.getCurrentUserId()) {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.favoritesService.initializeForUser(userId);
      }
      this.router.navigate(['/profile']);
      return;
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      ),
    ]),
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.email?.value as string,
        password: this.password?.value as string,
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('token', response.access_token); // Keep both for compatibility
            this.authService.setCurrentUserId(response.user.id);
            this.favoritesService.initializeForUser(response.user.id);
            this.router.navigate(['/profile']); // Navigate to profile instead of home
          } else if (response.requiresVerification) {
            // Handle unverified user case
            this.router.navigate(['/verify-email'], {
              queryParams: { email: this.email?.value },
            });
          }
        },
        error: (err) => {
          if (err.status === 401) {
            // Handle authentication errors
            if (err.error?.message === 'Invalid email or password') {
              this.email?.setErrors({ notFound: true });
              this.password?.setErrors({ incorrectPassword: true });
            }
          } else {
            console.error('Login failed:', err);
          }
        },
      });
    }
  }
}
