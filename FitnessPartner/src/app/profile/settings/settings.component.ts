import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  user: any = {};
  isEditing = false;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.userService.getUserById(userId).subscribe({
          next: (foundUser) => {
            this.user = foundUser;
            localStorage.setItem('user', JSON.stringify(foundUser));
          },
          error: (err) => {
            console.error('Error fetching user from API:', err);
            alert('Failed to load user data. Please try again.');
          },
        });
      } else {
        console.error('No userId found in localStorage');
        alert('User ID is missing. Please log in again.');
      }
    }
  }

  toggleEdit(): void {
    if (this.isEditing) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
    this.isEditing = !this.isEditing;
  }

  uploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  deleteAvatar(): void {
    this.user.avatar = 'profileImgRemove.png';
  }

  // saveChanges(): void {
  //   if (this.user.id) {
  //     console.log('Sending user data to API:', this.user); // Debugging line
  //     this.userService.editUserData(this.user.id, this.user).subscribe({
  //       next: (updatedUser) => {
  //         console.log('User updated successfully:', updatedUser);
  //         this.user = updatedUser;
  //         localStorage.setItem('user', JSON.stringify(updatedUser)); // Save updated user
  //         this.isEditing = false;
  //       },
  //       error: (err) => {
  //         console.error('Error updating user:', err);
  //         alert('Failed to update user. Please try again.');
  //       },
  //     });
  //   } else {
  //     console.error('User ID not found, unable to update.');
  //     alert('User ID is missing. Please refresh the page and try again.');
  //   }
  // }

  saveChanges(): void {
    localStorage.setItem('user', JSON.stringify(this.user));
    this.isEditing = false;
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'upload-photo'
    ) as HTMLInputElement;
    fileInput.click();
  }
}
