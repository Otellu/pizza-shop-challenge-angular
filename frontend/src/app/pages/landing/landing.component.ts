import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TopPizzasComponent } from '../../shared/top-pizzas/top-pizzas.component';
import { DeliveryBannerComponent } from '../../shared/delivery-banner/delivery-banner.component';
import { TestimonialsComponent } from '../../shared/testimonials/testimonials.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    TopPizzasComponent,
    DeliveryBannerComponent,
    TestimonialsComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Redirect authenticated users to appropriate dashboard
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin'], { replaceUrl: true });
      } else {
        this.router.navigate(['/menu'], { replaceUrl: true });
      }
    }
  }
}
