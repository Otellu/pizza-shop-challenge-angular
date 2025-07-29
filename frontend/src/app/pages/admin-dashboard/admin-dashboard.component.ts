import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Order } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Subject, interval, switchMap, takeUntil, catchError, of, startWith, Observable } from 'rxjs';

// ====================================================================
// Real-Time Admin Order Dashboard
// Time: ~30 minutes | Difficulty: Senior Level
// 
// Your implementation will be evaluated on:
// - Real-time data handling
// - Performance optimization
// - Memory management
// ====================================================================

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  // Component state
  orders: Order[] = [];
  loadingOrders = true;
  
  // TODO: Add properties for real-time functionality

  ngOnInit() {
    // TODO (5 min): Set up tab visibility handling
    // TODO (5 min): Implement real-time polling with RxJS
    // TODO (2 min): Load initial order data
    
    this.fetchOrders(); // Basic implementation - enhance this
  }

  ngOnDestroy() {
    // TODO: Clean up subscriptions and listeners
    this.destroy$.next();
    this.destroy$.complete();
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

  private startPolling(): void {
    // TODO: Implement real-time polling
    // Requirements:
    // - Poll at regular intervals
    // - Cancel previous requests
    // - Handle errors gracefully
  }

  private loadOrders(): Observable<Order[]> {
    // TODO: Load orders as Observable for polling
    return of([]);
  }

  private handleVisibilityChange(): void {
    // TODO: Optimize polling based on tab visibility
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): void {
    // TODO: Implement optimistic status updates
    // Requirements:
    // - Update UI immediately
    // - Call API to persist change
    // - Rollback on error
    // - Show appropriate feedback
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

  confirmOrder(order: Order): void {
    // TODO: Quick confirm action
    // This is a specific status update - enhance implementation
    this.apiService.confirmOrder(order.id).subscribe({
      next: () => this.toastService.success('Order confirmed'),
      error: () => this.toastService.error('Failed to confirm order')
    });
  }

  // TODO: Add status update functionality
  isOrderUpdating(orderId: string): boolean {
    return false;
  }

  // TODO: Add status update functionality
  getAvailableStatusTransitions(currentStatus: Order['status']): Order['status'][] {
    return [];
  }



  getAllStatuses(): string[] {
    return ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  }

  // TODO: Add status update functionality
  onStatusChange(orderId: string, event: Event) {
    
  }

  // TODO: Add status update functionality
  isStatusTransitionAllowed(currentStatus: Order['status'], newStatus: Order['status']): boolean {
    return false;
  }

  
}
