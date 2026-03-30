import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" *ngIf="authService.isLoggedIn()">
      <div class="nav-brand">
        <a routerLink="/home"><strong>Quanment</strong></a>
      </div>
      <div class="nav-links">
        <a routerLink="/conversion"  routerLinkActive="active">Conversion</a>
        <a routerLink="/arithmetic"  routerLinkActive="active">Arithmetic</a>
        <a routerLink="/history"     routerLinkActive="active">History</a>
        <span class="nav-user">{{ authService.getUserName() }}</span>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 32px; height: 56px; background: #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    .nav-brand a { font-size: 20px; font-weight: 700; color: #222; text-decoration: none; }
    .nav-links { display: flex; align-items: center; gap: 28px; }
    .nav-links a { color: #555; font-size: 15px; text-decoration: none; }
    .nav-links a.active { color: #5b6ef5; font-weight: 600; }
    .nav-user { color: #888; font-size: 14px; }
    .logout-btn {
      background: none; border: 1px solid #ddd; border-radius: 6px;
      padding: 6px 14px; cursor: pointer; font-size: 14px; color: #555;
    }
    .logout-btn:hover { background: #f5f5f5; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
