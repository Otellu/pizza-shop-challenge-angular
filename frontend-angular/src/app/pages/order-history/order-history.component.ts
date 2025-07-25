import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService, Order } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

// ====================================================================
// 🎯 FEATURE 3: Order Complaint Form with Advanced Validation (25 minutes)
// ====================================================================
//
// CURRENT STATE: Empty component with no functionality
// YOUR TASK: Build a comprehensive complaint system for user orders
//
// 🚀 IMPLEMENT THESE FEATURES:
//
// ✅ 1. ORDER HISTORY DISPLAY (8 minutes)
//    - Fetch user orders using this.apiService.getUserOrders()
//    - Display orders in a responsive layout with order details
//    - Add "File Complaint" button/link for each order
//    - Show order status, items, date, and total amount
//
// ✅ 2. REACTIVE FORMS SETUP (8 minutes)
//    - Create FormGroup with proper TypeScript typing
//    - Add fields: complaintType (dropdown), description (textarea), priority (radio), contactPreference (checkboxes)
//    - Use FormBuilder to construct the form structure
//    - Implement proper form initialization and reset
//
// ✅ 3. ADVANCED VALIDATION (6 minutes)
//    - Custom validator for description minimum 20 characters
//    - Required field validation for complaintType and priority
//    - Real-time validation with error display as user types
//    - Form state management (dirty, touched, valid states)
//
// ✅ 4. FORM SUBMISSION & UX (3 minutes)
//    - Handle form submission with API call to POST /api/orders/:id/complaint
//    - Show loading states during submission
//    - Success/error feedback with toast notifications
//    - Reset form and close modal/section after successful submission
//
// 💡 HINTS:
// - Use FormArray for contactPreference checkboxes
// - Modal can be simple show/hide with *ngIf directive
// - API endpoint: POST /api/orders/:orderId/complaint
// - Consider using signals for reactive state management
// - Handle form validation errors gracefully

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

  // ========================================
  // 🚀 TODO: ADD COMPONENT STATE
  // ========================================
  orders: Order[] = [];
  loadingOrders = true;
  selectedOrderId: string | null = null;
  showComplaintForm = false;
  submittingComplaint = false;

  // ========================================
  // 🚀 TODO: CREATE REACTIVE FORM
  // ========================================
  complaintForm: FormGroup;

  constructor() {
    // TODO: Initialize the complaint form with proper validation
    // this.complaintForm = this.formBuilder.group({
    //   complaintType: ['', Validators.required],
    //   description: ['', [Validators.required, this.minLengthValidator(20)]],
    //   priority: ['', Validators.required],
    //   contactPreference: this.formBuilder.array([])
    // });
    
    // Temporary form setup - replace with proper implementation
    this.complaintForm = this.formBuilder.group({});
  }

  ngOnInit() {
    // ========================================
    // 🚀 TODO: LOAD USER ORDERS
    // ========================================
    // Call this.loadUserOrders() to fetch the user's order history
    // Handle loading states and errors properly
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================================
  // 🚀 TODO: IMPLEMENT ORDER LOADING
  // ========================================
  
  private loadUserOrders() {
    // TODO: Implement order loading
    // this.loadingOrders = true;
    // this.apiService.getUserOrders()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (orders) => {
    //       this.orders = orders;
    //       this.loadingOrders = false;
    //     },
    //     error: (error) => {
    //       this.toastService.error('Failed to load order history');
    //       this.loadingOrders = false;
    //     }
    //   });
  }

  // ========================================
  // 🚀 TODO: IMPLEMENT COMPLAINT FUNCTIONALITY
  // ========================================

  openComplaintForm(orderId: string) {
    // TODO: Set up complaint form for specific order
    // this.selectedOrderId = orderId;
    // this.showComplaintForm = true;
    // this.resetComplaintForm();
  }

  closeComplaintForm() {
    // TODO: Close and reset the complaint form
    // this.showComplaintForm = false;
    // this.selectedOrderId = null;
    // this.resetComplaintForm();
  }

  submitComplaint() {
    // ========================================
    // 🚀 TODO: IMPLEMENT COMPLAINT SUBMISSION
    // ========================================
    //
    // 1. Validate the form
    // 2. Get form values and orderId
    // 3. Set submitting state
    // 4. Call API: this.apiService.submitComplaint(orderId, complaintData)
    // 5. Handle success: show toast, close form, refresh orders
    // 6. Handle error: show error toast, keep form open
    //
    // EXAMPLE:
    // if (this.complaintForm.valid && this.selectedOrderId) {
    //   this.submittingComplaint = true;
    //   const complaintData = this.complaintForm.value;
    //   
    //   // Make API call here
    //   // Handle response
    // }
  }

  private resetComplaintForm() {
    // TODO: Reset form to initial state
    // this.complaintForm.reset();
    // Clear validation errors
  }

  // ========================================
  // 🚀 TODO: IMPLEMENT CUSTOM VALIDATORS
  // ========================================

  private minLengthValidator(minLength: number) {
    // TODO: Create custom validator for minimum length
    // return (control: AbstractControl) => {
    //   if (!control.value || control.value.length >= minLength) {
    //     return null;
    //   }
    //   return { minLength: { requiredLength: minLength, actualLength: control.value.length } };
    // };
    return null; // Temporary return
  }

  // ========================================
  // 🚀 TODO: ADD HELPER METHODS
  // ========================================

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
    return ((order as any)._id || order.id)?.slice(-6) || 'N/A';
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
