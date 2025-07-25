import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/orders']);
  }
}
