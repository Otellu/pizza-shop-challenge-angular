import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Order } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Subject, interval, switchMap, takeUntil, catchError, of, startWith } from 'rxjs';

// ====================================================================
// 🎯 FEATURE 2: Real-Time Admin Order Dashboard (30 minutes)
// ====================================================================
//
// CURRENT STATE: Basic order fetching with manual refresh
// YOUR TASK: Transform this into a real-time admin dashboard
//
// 🚀 IMPLEMENT THESE FEATURES:
//
// ✅ 1. REAL-TIME POLLING (12 minutes)
//    - Use RxJS interval() to poll orders every 3-5 seconds
//    - Use switchMap() to prevent overlapping requests
//    - Start polling in ngOnInit, stop in ngOnDestroy
//    - Handle errors without breaking the polling loop
//
// ✅ 2. ORDER STATUS MANAGEMENT (10 minutes)
//    - Create updateOrderStatus() method using admin API
//    - Implement optimistic UI updates for better UX
//    - Add loading states for individual order updates
//    - Handle API errors with proper rollback
//
// ✅ 3. TAB VISIBILITY OPTIMIZATION (5 minutes)
//    - Pause polling when document.visibilityState === 'hidden'
//    - Resume polling when tab becomes visible again
//    - Use document.addEventListener('visibilitychange')
//    - Prevent unnecessary API calls for performance
//
// ✅ 4. REAL-TIME UI FEATURES (3 minutes)
//    - Add status transition buttons (confirm, update status)
//    - Show real-time timestamps and order counts
//    - Add visual feedback for status changes
//    - Implement proper error boundaries
//
// 💡 HINTS:
// - API endpoints: GET /api/admin/orders, PATCH /api/admin/orders/:id/status
// - Use startWith(0) to trigger immediate first load
// - Don't forget to unsubscribe in ngOnDestroy
// - Consider using signals for reactive state management

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

  // ========================================
  // 🚀 TODO: ADD REAL-TIME STATE MANAGEMENT
  // ========================================
  orders: Order[] = [];
  loadingOrders = true;
  
  // TODO: Add these properties for real-time functionality:
  // private isPolling = false;
  // private pollingInterval = 5000; // 5 seconds
  // private isTabVisible = true;

  ngOnInit() {
    // ========================================
    // 🚀 TODO: IMPLEMENT REAL-TIME POLLING
    // ========================================
    //
    // REPLACE this basic fetchOrders() call with real-time polling:
    //
    // 1. Set up tab visibility listener:
    //    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    //
    // 2. Start real-time polling:
    //    this.startPolling();
    //
    // 3. Set up the polling stream:
    //    interval(this.pollingInterval)
    //      .pipe(
    //        startWith(0), // Trigger immediate load
    //        switchMap(() => this.isTabVisible ? this.apiService.getAllOrders() : of(this.orders)),
    //        catchError(error => { /* handle without breaking stream */ return of(this.orders); }),
    //        takeUntil(this.destroy$)
    //      )
    //      .subscribe(orders => this.orders = orders);
    
    this.fetchOrders();
  }

  ngOnDestroy() {
    // ========================================
    // 🚀 TODO: CLEANUP SUBSCRIPTIONS
    // ========================================
    this.destroy$.next();
    this.destroy$.complete();
    // TODO: Remove visibility listener:
    // document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
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

  // ========================================
  // 🚀 TODO: IMPLEMENT REAL-TIME METHODS
  // ========================================

  private startPolling() {
    // TODO: Implement real-time polling with RxJS
    // Example:
    // interval(this.pollingInterval)
    //   .pipe(
    //     startWith(0),
    //     switchMap(() => this.loadOrders()),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe();
  }

  private loadOrders() {
    // TODO: Convert fetchOrders to return Observable instead of Promise
    // return this.apiService.getAllOrders().pipe(
    //   catchError(error => {
    //     console.error('Polling error:', error);
    //     return of(this.orders); // Return current orders on error
    //   })
    // );
  }

  private handleVisibilityChange() {
    // TODO: Handle tab visibility changes
    // this.isTabVisible = document.visibilityState === 'visible';
    // if (this.isTabVisible) {
    //   // Immediately fetch fresh data when tab becomes visible
    //   this.fetchOrders();
    // }
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']) {
    // ========================================
    // 🚀 TODO: IMPLEMENT STATUS UPDATES
    // ========================================
    //
    // 1. Find the order in the local array
    // 2. Store the original status for rollback
    // 3. Optimistically update the UI
    // 4. Call this.apiService.updateOrderStatus(orderId, newStatus)
    // 5. On success: show success toast
    // 6. On error: rollback the status and show error toast
    //
    // EXAMPLE:
    // const order = this.orders.find(o => o.id === orderId);
    // if (!order) return;
    // 
    // const originalStatus = order.status;
    // order.status = newStatus; // Optimistic update
    // 
    // this.apiService.updateOrderStatus(orderId, newStatus)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (updatedOrder) => {
    //       this.toastService.success(`Order status updated to ${newStatus}`);
    //     },
    //     error: (error) => {
    //       order.status = originalStatus; // Rollback
    //       this.toastService.error('Failed to update order status');
    //     }
    //   });
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
