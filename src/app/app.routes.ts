import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'conversion',
    loadComponent: () => import('./conversion/conversion.component').then(m => m.ConversionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'arithmetic',
    loadComponent: () => import('./arithmetic/arithmetic.component').then(m => m.ArithmeticComponent),
    canActivate: [authGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'home' }
];
