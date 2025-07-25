import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  name = '';
  address = '';
  placing = false;

  get cartSummary() {
    return this.cartService.getCartSummary();
  }

  get totalAmount() {
    return this.cartService
      .items()
      .reduce((total, pizza) => total + pizza.price, 0);
  }

  async handlePlaceOrder() {
    if (!this.address) {
      this.toastService.error('Please fill in all fields');
      return;
    }

    if (this.cartService.items().length === 0) {
      this.toastService.error('Your cart is empty');
      return;
    }

    this.placing = true;
    try {
      console.log('Cart items:', this.cartService.items());
      const orderData = {
        items: this.cartService.items(),
        deliveryAddress: this.address,
        totalAmount: this.totalAmount,
      };
      console.log('Order data:', orderData);

      const response = (await this.apiService
        .createOrder(orderData)
        .toPromise()) as any;

      this.cartService.clearCart();
      this.toastService.success('Order placed successfully!');
      this.router.navigate(['/orders']);
    } catch (error: any) {
      console.error('Order placement error:', error);
      this.toastService.error(
        error.error?.message || error.message || 'Failed to place order'
      );
    } finally {
      this.placing = false;
    }
  }
}
