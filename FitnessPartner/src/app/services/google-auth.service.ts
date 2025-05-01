// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from './auth.service';
// import { Router } from '@angular/router';
// import { environment } from '../../environment';

// declare const google: any;

// @Injectable({
//   providedIn: 'root',
// })
// export class GoogleAuthService {
//   private apiUrl = environment.apiUrl;

//   constructor(
//     private http: HttpClient,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   initializeGoogleAuth(buttonId: string, isSignUp: boolean = false): void {
//     google.accounts.id.initialize({
//       client_id: environment.googleClientId,
//       callback: (response: any) => this.handleGoogleSignIn(response, isSignUp),
//     });

//     google.accounts.id.renderButton(document.getElementById(buttonId), {
//       type: 'standard',
//       theme: 'outline',
//       size: 'large',
//       text: isSignUp ? 'signup_with' : 'signin_with',
//       width: '100%',
//     });
//   }

//   private handleGoogleSignIn(response: any, isSignUp: boolean): void {
//     if (response.credential) {
//       const payload = this.decodeJwtResponse(response.credential);

//       const googleAuthData = {
//         email: payload.email,
//         firstName: payload.given_name,
//         lastName: payload.family_name,
//         accessToken: response.credential,
//       };

//       this.http.post(`${this.apiUrl}/auth/google`, googleAuthData).subscribe({
//         next: (res: any) => {
//           if (res.access_token) {
//             this.authService.setCurrentUserId(res.user.id);
//             localStorage.setItem('access_token', res.access_token);
//             this.router.navigate(['/profile']);
//           }
//         },
//         error: (err) => {
//           console.error('Google auth failed:', err);
//         },
//       });
//     }
//   }

//   private decodeJwtResponse(token: string): any {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   }
// }

// google-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environment';
import { FavoritesService } from './favorites.service';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  initializeGoogleAuth(buttonId: string, isSignUp: boolean = false): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleSignIn(response, isSignUp),
    });

    const button = document.getElementById(buttonId);
    if (button) {
      google.accounts.id.renderButton(button, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: isSignUp ? 'signup_with' : 'signin_with',
        width: '100%',
      });

      // Optional: Add prompt to show One Tap UI
      google.accounts.id.prompt();
    }
  }

  private handleGoogleSignIn(response: any, isSignUp: boolean): void {
    if (response.credential) {
      const payload = this.decodeJwtResponse(response.credential);

      const googleAuthData = {
        email: payload.email,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        accessToken: response.credential,
        photoUrl: payload.picture || null,
      };

      this.http.post(`${this.apiUrl}/auth/google`, googleAuthData).subscribe({
        next: (res: any) => {
          if (res.access_token) {
            this.authService.setCurrentUserId(res.user.id);
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));

            // Initialize favorites for the user
            this.favoritesService.initialize();

            // Navigate based on whether it's signup or login
            this.router.navigate(['/profile']);
          }
        },
        error: (err) => {
          console.error('Google auth failed:', err);
          // Handle error appropriately
        },
      });
    }
  }

  private decodeJwtResponse(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }
}
