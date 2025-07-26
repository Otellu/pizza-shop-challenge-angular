import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService, Order, OrderItem } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

// ====================================================================
// 🎯 SENIOR CHALLENGE: Order Complaint Form with Advanced Validation
// Time: ~25 minutes | Difficulty: Senior Level
// 
// Your implementation will be evaluated on:
// - Advanced form validation techniques
// - Reactive forms expertise
// - Error handling
// - User experience
// ====================================================================

interface ComplaintForm {
  complaintType: 'Quality Issue' | 'Delivery Problem' | 'Wrong Order' | 'Other';
  description: string;
  priority: 'low' | 'medium' | 'high';
  contactPreference: string[]; // ['email', 'phone']
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  // Component state
  orders: Order[] = [];
  loadingOrders = true;
  selectedOrderId: string | null = null;
  showComplaintForm = false;
  submittingComplaint = false;

  // Reactive form instance
  complaintForm: FormGroup;

  constructor() {
    // TODO: Initialize form with proper validation
    this.initializeForm();
  }

  ngOnInit() {
    this.loadUserOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserOrders(): void {
    // TODO: Load user's order history
    // Requirements:
    // - Fetch orders from API
    // - Handle loading states
    // - Display appropriate error messages
    
    this.loadingOrders = true;
    this.apiService.getUserOrders().subscribe({
      next: (orders) => this.orders = orders,
      error: () => this.toastService.error('Failed to load orders'),
      complete: () => this.loadingOrders = false
    });
  }

  openComplaintForm(orderId: string): void {
    // TODO: Open complaint form for specific order
    this.selectedOrderId = orderId;
    this.showComplaintForm = true;
  }

  closeComplaintForm(): void {
    // TODO: Close form and reset state
    this.showComplaintForm = false;
    this.selectedOrderId = null;
  }

  submitComplaint(): void {
    // TODO: Submit complaint to API
    // Requirements:
    // - Validate form before submission
    // - Show loading state during API call
    // - Handle success/error appropriately
    // - Reset form on success
  }

  private resetComplaintForm(): void {
    // TODO: Reset form to initial state
    this.complaintForm.reset();
  }

  private minLengthValidator(minLength: number): any {
    // TODO: Create custom validator
    return null;
  }
  
  private initializeForm(): void {
    // TODO: Set up form with validation rules
    this.complaintForm = this.formBuilder.group({
      complaintType: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      contactPreference: this.formBuilder.array([])
    });
  }

  // Helper methods for template

  getComplaintTypes() {
    return [
      { value: 'Quality Issue', label: 'Quality Issue' },
      { value: 'Delivery Problem', label: 'Delivery Problem' },
      { value: 'Wrong Order', label: 'Wrong Order' },
      { value: 'Other', label: 'Other' }
    ];
  }

  getPriorityOptions() {
    return [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' }
    ];
  }

  getContactOptions() {
    return [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' }
    ];
  }

  // Helper methods for template
  getOrderId(order: Order): string {
    return order.id?.slice(-6) || 'N/A';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
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
}
