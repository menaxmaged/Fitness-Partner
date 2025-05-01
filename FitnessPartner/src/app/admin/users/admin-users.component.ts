// admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-admin-users',
  templateUrl: `admin-users.component.html`,
  styleUrl: `admin-users.component.css`
})
export class AdminUsersComponent implements OnInit {
  users: any[] = []; // Initialize with empty array
  roles = ['user', 'admin', 'moderator'];

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  onRoleChange(userId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;  // Cast the event target to HTMLSelectElement
    const selectedRole = target.value;  // Get the selected value
    this.updateUserRole(userId, selectedRole);  // Call your method to update the user role
  }
  
  updateUserRole(userId: string, selectedRole: string) {
    console.log('User ID:', userId);
    console.log('Selected Role:', selectedRole);
    
    this.usersService.updateUserRoleByAdmin(userId, selectedRole).pipe(
      tap(() => this.loadUsers()),
      catchError(err => {
        console.error('Role update failed:', err);
        return throwError(() => err);
      })
    ).subscribe();
  }
}