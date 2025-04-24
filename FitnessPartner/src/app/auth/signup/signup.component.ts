import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { v4 as generateId } from 'uuid';
import { User } from '../../shared/utils/user';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  usersData: any[] = []; 

  constructor(private myUserService: UsersService, private router: Router) {}
  ngOnInit(): void {
    this.myUserService.getAllUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.usersData = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  registerForm = new FormGroup({
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
  });
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
   
  onSubmit() {
    if (this.registerForm.valid) {
      // Check if passwords match
      if (this.password?.value !== this.confirmPassword?.value) {
        this.confirmPassword?.setErrors({ passwordMismatch: true });
        return;
      }

      const newUser: User = {
        fName: this.fName?.value ?? null,
        lName: this.lName?.value ?? null,
        email: this.email?.value ?? null,
        password: this.password?.value ?? null,
      };

      // We don't need to generate ID here - the backend will do it
      // No need to check if email exists - backend will handle that

      this.myUserService.addANewUser(newUser).subscribe({
        next: (response: any) => {
          // Store the JWT token instead of base64 encoded ID
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('userId', response.user.id);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error registering user:', err);
          if (err.status === 409) {
            // Handle email already exists
            this.registerForm.controls['email'].setErrors({ found: true });
          }
        },
      });
    }
  }
}

