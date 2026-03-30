import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}/login`, data);
  }

  saveSession(token: string, name: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserName(): string {
    return localStorage.getItem('name') || '';
  }

  getUserEmail(): string {
    return localStorage.getItem('email') || '';
  }
}
