import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="brand">Quanment</h1>
        <h2>Create Account</h2>
        <p class="subtitle">Start converting quantities today.</p>

        <div class="error" *ngIf="error">{{ error }}</div>

        <div class="form-group">
          <label>Name</label>
          <input type="text" [(ngModel)]="name" placeholder="Enter your name" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" placeholder="Create a password" />
        </div>

        <button class="btn-primary" (click)="register()" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>

        <p class="switch-link">Already have an account? <a routerLink="/login">Sign In</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .auth-card {
      background: #fff;
      border-radius: 12px;
      padding: 40px 36px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .brand { font-size: 24px; font-weight: 800; color: #222; margin-bottom: 20px; }
    h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .subtitle { color: #888; font-size: 14px; margin-bottom: 24px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: #444; }
    input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border 0.2s;
    }
    input:focus { border-color: #4a6cf7; }
    .btn-primary {
      width: 100%;
      padding: 12px;
      background: #4a6cf7;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
    }
    .btn-primary:hover { background: #3a5ce6; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .switch-link { text-align: center; margin-top: 16px; font-size: 14px; color: #888; }
    .switch-link a { color: #4a6cf7; font-weight: 500; }
    .error { background: #fef2f2; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.error = '';
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.saveSession(res.token, res.name, res.email);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.error = err.error || 'Registration failed. Try again.';
        this.loading = false;
      }
    });
  }
}
