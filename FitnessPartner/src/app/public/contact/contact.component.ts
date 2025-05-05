import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TranslateModule, FormsModule, CommonModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  contactData = {
    name: '',
    email: '',
    message: '',
  };
  emailSent = false;
  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.contactData.name || !this.contactData.email || !this.contactData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out all fields',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Message sent successfully',
      timer: 3000
    });
            this.contactData = { name: '', email: '', message: '' };

    // Swal.fire({
    //   title: 'Sending...',
    //   text: 'Your message is being sent',
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
      
    // });

    // this.http.post('http://localhost:3000/email/contact', this.contactData).subscribe({
    //   next: () => {
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Success!',
    //       text: 'Message sent successfully',
    //       timer: 3000
    //     });
    //     this.contactData = { name: '', email: '', message: '' };
    //     this.emailSent = true;
    //   },
      // error: (err) => {
      //   console.error('Failed to send message', err);
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Error',
      //     text: 'Failed to send message',
      //   });
      // },
    // });
  }
}