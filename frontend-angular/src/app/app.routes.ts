import { Routes } from '@angular/router';
import { authGuard, adminGuard, publicOnlyGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes (landing page, login, signup)
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [publicOnlyGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then((m) => m.SignupComponent),
    canActivate: [publicOnlyGuard],
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/user-landing/user-landing.component').then(
        (m) => m.UserLandingComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/order-history/order-history.component').then(
        (m) => m.OrderHistoryComponent
      ),
    canActivate: [authGuard],
  },

  // Admin routes
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    canActivate: [adminGuard],
  },

  // Error pages
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./pages/not-authorized/not-authorized.component').then(
        (m) => m.NotAuthorizedComponent
      ),
  },

  // Wildcard route - keep this last
  {
    path: '**',
    redirectTo: '',
  },
];
