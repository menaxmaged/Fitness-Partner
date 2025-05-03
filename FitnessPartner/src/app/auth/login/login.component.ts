// login.component.ts
import { Component, OnInit } from '@angular/core';
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
import { GoogleAuthService } from '../../services/google-auth.service';
import { AfterViewInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
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

  constructor(
    private myUserService: UsersService,
    private router: Router,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngAfterViewInit(): void {
    this.googleAuthService.initializeGoogleButton(
      'google-login-button',
      (response: any) => this.handleGoogleSignIn(response)
    );
  }

  ngOnInit(): void {
    // If already authenticated, sync favorites and redirect
    if (this.authService.isAuthenticated()) {
      this.favoritesService.initialize();
      // this.router.navigate(['/profile']);
      return;
    }
  }

  handleGoogleSignIn(response: any) {
    this.authService.googleAuth(response.credential).subscribe({
      next: (authResponse) => {
        this.authService.setCurrentUserId(authResponse.user.id);
        this.favoritesService.initialize();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Google login failed:', err);
      },
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    const loginData = {
      email: this.email?.value as string,
      password: this.password?.value as string,
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        if (response.access_token) {
          // Store userId & token via AuthService
          this.authService.setCurrentUserId(response.user.id);
          // Sync favorites for this user
          this.favoritesService.initialize();
          // Navigate to profile
          this.router.navigate(['/home']);
        } else if (response.requiresVerification) {
          // Handle email verification flow
          this.router.navigate(['/verify-email'], {
            queryParams: { email: this.email?.value },
          });
        }
      },
      error: (err) => {
        if (
          err.status === 401 &&
          err.error?.message === 'Invalid email or password'
        ) {
          // Mark form fields with errors
          this.email?.setErrors({ notFound: true });
          this.password?.setErrors({ incorrectPassword: true });
        } else {
          console.error('Login failed:', err);
        }
      },
    });
  }
}
