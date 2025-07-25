import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Order } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);

  orders: Order[] = [];
  loadingOrders = true;

  ngOnInit() {
    this.fetchOrders();
  }

  async fetchOrders() {
    this.loadingOrders = true;
    try {
      this.orders = await this.apiService.getAllOrders().toPromise() as Order[];
    } catch (error) {
      this.toastService.error('Failed to fetch orders');
      this.orders = [];
    } finally {
      this.loadingOrders = false;
    }
  }

  get totalOrders() {
    return this.orders.length;
  }

  get pendingOrders() {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  get deliveredOrders() {
    return this.orders.filter(o => o.status === 'delivered').length;
  }

  get totalRevenue() {
    return this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  getOrderId(order: Order): string {
    return ((order as any)._id || order.id)?.slice(-6) || 'N/A';
  }

  getItemsPreview(items: any[]): string {
    const preview = items.slice(0, 2).map(item => item.name).join(', ');
    return items.length > 2 ? `${preview}...` : preview;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString();
  }

  async confirmOrder(order: Order) {
    try {
      await this.apiService.confirmOrder(order.id).toPromise();
      this.toastService.success('Order confirmed successfully');
      this.fetchOrders(); // Refresh the orders list
    } catch (error) {
      this.toastService.error('Failed to confirm order');
    }
  }
}
