import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service'; // Add this import

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
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.getCurrentUserId()) {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.favoritesService.initializeForUser(userId);
      }
      this.router.navigate(['/profile']);
      return;
    }

    this.myUserService.getAllUsers().subscribe({
      next: (data) => (this.usersData = data),
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    ]),
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.valid) {
      const user = this.usersData.find(u => u.email === this.email?.value);

      if (!user) {
        this.loginForm.controls['email']?.setErrors({ notFound: true });
      } else if (user.password !== this.password?.value) {
        this.loginForm.controls['password']?.setErrors({ incorrectPassword: true });
      } else {
        const token = btoa(user.id.toString());
        this.authService.login(token); // Use AuthService login
        this.favoritesService.initializeForUser(user.id);
        this.router.navigate(['/home']);
      }
    }
  }
}