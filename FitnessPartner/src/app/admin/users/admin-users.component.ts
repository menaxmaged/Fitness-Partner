import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  standalone: true, // Add standalone: true
  imports: [CommonModule]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  roles = ['user', 'admin', 'moderator'];
  loading = false;
  error: string | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;
    
    console.log('Fetching all users...');
    
    this.usersService.getAllUsers().pipe(
      tap(users => {
        console.log('Users data received:', users);
      }),
      catchError(err => {
        this.error = `Error loading users: ${err.message || 'Unknown error'}`;
        console.error('Failed to load users:', err);
        return throwError(() => err);
      })
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        console.log('Users loaded successfully, count:', users.length);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onRoleChange(userId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedRole = target.value;
    this.updateUserRole(userId, selectedRole);
  }
  
  updateUserRole(userId: string, selectedRole: string) {
    console.log('Updating user role - User ID:', userId);
    console.log('Selected Role:', selectedRole);
    
    this.usersService.updateUserRoleByAdmin(userId, selectedRole).pipe(
      tap(() => {
        console.log('User role updated successfully');
        this.loadUsers();
      }),
      catchError(err => {
        console.error('Role update failed:', err);
        return throwError(() => err);
      })
    ).subscribe();
  }
}