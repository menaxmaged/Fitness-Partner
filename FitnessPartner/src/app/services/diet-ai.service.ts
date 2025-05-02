import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DietAiService {
  private apiUrl = 'http://localhost:3000/diet-plan';

  constructor(private http: HttpClient) {}

  generateDietPlan(data: any): Observable<string> {
    return this.http.post(this.apiUrl, data, { responseType: 'text' });
  }
}
