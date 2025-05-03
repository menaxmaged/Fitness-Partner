import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  ValidatorFn,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/utils/user';
import { AuthService } from '../../services/auth.service';
import { GoogleAuthService } from '../../services/google-auth.service';
import { TranslateModule,TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule,TranslateModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  usersData: any[] = [];
  showOtpForm = false;
  registeredEmail = '';
  otpError = '';
  otpResent = false;

  constructor(
    private myUserService: UsersService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private googleAuthService: GoogleAuthService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.getCurrentUserId()) {
      this.router.navigate(['/profile']);
      return;
    }

    this.myUserService.getAllUsers().subscribe({
      next: (data) => {
        this.usersData = data;
      },
      error: (err) => {
        console.log(err);
      },
    });

    // Initialize Google button
    setTimeout(() => {
      this.googleAuthService.initializeGoogleButton(
        'google-signup-button',
        (response: any) => this.handleGoogleSignUp(response)
      );
    }, 100);
  }

  handleGoogleSignUp(response: any) {
    this.authService.googleAuth(response.credential).subscribe({
      next: (authResponse) => {
        this.authService.setCurrentUserId(authResponse.user.id);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Google signup failed:', err);
      },
    });
  }

  registerForm = new FormGroup(
    {
      fName: new FormControl(null, Validators.required),
      lName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        ),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    { validators: this.passwordMatchValidator as ValidatorFn }
  );

  otpForm = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^[0-9]+$/),
    ]),
  });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get fName() {
    return this.registerForm.get('fName');
  }

  get lName() {
    return this.registerForm.get('lName');
  }

  get otp() {
    return this.otpForm.get('otp');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Check if passwords match is now handled by the form validator

      const newUser: User = {
        fName: this.fName?.value ?? null,
        lName: this.lName?.value ?? null,
        email: this.email?.value ?? null,
        password: this.password?.value ?? null,
      };

      this.myUserService.addANewUser(newUser).subscribe({
        next: (response: any) => {
          console.log('Registration successful, OTP sent');
          this.registeredEmail = this.email?.value ?? '';
          this.showOtpForm = true;
        },
        error: (err) => {
          console.error('Error registering user:', err);
          if (err.status === 409) {
            this.registerForm.controls['email'].setErrors({ found: true });
          } else {
            alert('An unexpected error occurred. Please try again later.');
          }
        },
      });
    }
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) return;

    const otpValue = this.otp?.value ?? '';

    this.myUserService.verifyOtp(this.registeredEmail, otpValue).subscribe({
      next: (response: any) => {
        if (response?.access_token && response?.user?.id) {
          // Store token
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('access_token', response.access_token); // for compatibility
          localStorage.setItem('userId', response.user.id);

          // Optional: Store user data in localStorage for SettingsComponent
          localStorage.setItem('user', JSON.stringify(response.user));

          // Set current user in AuthService
          this.authService.setCurrentUserId(response.user.id);

          // Navigate to profile
          this.router.navigate(['/home']);
        } else {
          console.error('Invalid response from server:', response);
        }
      },
      error: (err: any) => {
        console.error('OTP verification failed:', err);
        this.otpError = 'Invalid OTP code. Please try again.';
        this.otpForm.controls['otp'].setErrors({ invalid: true });
      },
    });
  }

  resendOtp() {
    this.myUserService.resendOtp(this.registeredEmail).subscribe({
      next: () => {
        this.otpResent = true;
        setTimeout(() => {
          this.otpResent = false;
        }, 3000);
      },
      error: (err: any) => {
        console.error('Failed to resend OTP:', err);
      },
    });
  }

  backToSignup() {
    this.showOtpForm = false;
    this.otpForm.reset();
    this.otpError = '';
  }
}
