// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class UsersService {
//   constructor(private myClient: HttpClient) {}
//   private URLData = 'http://localhost:3000/users';

//   getAllUsers() {
//     return this.myClient.get<any>(this.URLData);
//   }
//   addANewUser(newUser: any) {
//     return this.myClient.post(this.URLData, newUser);
//   }
//   getUserById(id: any) {
//     return this.myClient.get(`${this.URLData}/${id}`);
//   }
//   deleteUser(id: any) {
//     return this.myClient.delete(`${this.URLData}/${id}`);
//   }
//   editUserData(id: any, updatedUser: any) {
//     return this.myClient.put(`${this.URLData}/${id}`, updatedUser);
//   }
// }

////////////////// TESTING BACKEND BELOW //////////////////////// ORIGINAL CODE ABOVE //// DO NOT DELETE ///////

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/utils/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}
  private baseUrl = 'http://localhost:3000';

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  addANewUser(newUser: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/register`, newUser);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/users/${id}`);
  }

  editUserData(id: string, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, updatedUser);
  }
}