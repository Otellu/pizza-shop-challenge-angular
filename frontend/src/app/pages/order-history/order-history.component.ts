import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService, Order, OrderItem } from '../../services/api.service';
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
  email?: string; // Optional, with email validation when provided
  phone?: string; // Optional, with India phone number validation (+91 format) when provided
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
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

  // Static arrays for form options
  complaintTypes = [
    { value: 'Quality Issue', label: 'Quality Issue' },
    { value: 'Delivery Problem', label: 'Delivery Problem' },
    { value: 'Wrong Order', label: 'Wrong Order' },
    { value: 'Other', label: 'Other' },
  ];


  // ========================================
  // 🚀 TODO: CREATE REACTIVE FORM
  // ========================================
  complaintForm: FormGroup;

  constructor() {
    // Initialize reactive form with custom validation
    this.complaintForm = this.formBuilder.group({
      complaintType: ['', Validators.required],
      description: ['', [Validators.required, this.minLengthValidator(20)]],
      email: ['', this.emailValidator],
      phone: ['', this.indiaPhoneValidator],
    }, { validators: this.atLeastOneContactValidator });
  }

  ngOnInit() {
    this.loadUserOrders();
    console.log('Component initialized - complaintTypes:', this.complaintTypes);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================================
  // 🚀 TODO: IMPLEMENT ORDER LOADING
  // ========================================

  private loadUserOrders() {
    this.loadingOrders = true;
    this.apiService
      .getUserOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loadingOrders = false;
        },
        error: (error) => {
          this.toastService.error('Failed to load order history');
          this.loadingOrders = false;
        },
      });
  }

  // ========================================
  // 🚀 TODO: IMPLEMENT COMPLAINT FUNCTIONALITY
  // ========================================

  openComplaintForm(orderId: string) {
    console.log('Opening complaint form for order:', orderId);
    this.selectedOrderId = orderId;
    this.showComplaintForm = true;
    this.resetComplaintForm();
    console.log('Form state:', this.complaintForm.value);
    console.log('Show form:', this.showComplaintForm);
  }

  closeComplaintForm() {
    this.showComplaintForm = false;
    this.selectedOrderId = null;
    this.resetComplaintForm();
  }

  submitComplaint() {
    if (this.complaintForm.valid && this.selectedOrderId) {
      this.submittingComplaint = true;

      const formValue = this.complaintForm.value;

      const complaintData: ComplaintForm = {
        complaintType: formValue.complaintType,
        description: formValue.description,
      };
      
      // Only include email/phone if they have values
      if (formValue.email && formValue.email.trim()) {
        complaintData.email = formValue.email.trim();
      }
      if (formValue.phone && formValue.phone.trim()) {
        complaintData.phone = formValue.phone.trim();
      }

      this.apiService
        .submitComplaint(this.selectedOrderId, complaintData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.submittingComplaint = false;
            this.toastService.success(
              'Complaint submitted successfully! We will review it shortly.'
            );
            this.closeComplaintForm();
            this.loadUserOrders(); // Refresh orders to show complaint status
          },
          error: (error) => {
            this.submittingComplaint = false;
            const errorMessage =
              error.error?.message ||
              'Failed to submit complaint. Please try again.';
            this.toastService.error(errorMessage);
            console.error('Complaint submission error:', error);
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.complaintForm);
    }
  }

  private resetComplaintForm() {
    this.complaintForm.reset();
    console.log('Form reset');
  }

  // ========================================
  // 🚀 TODO: IMPLEMENT CUSTOM VALIDATORS
  // ========================================

  private minLengthValidator(minLength: number) {
    return (control: AbstractControl) => {
      if (!control.value || control.value.length >= minLength) {
        return null;
      }
      return {
        minLength: {
          requiredLength: minLength,
          actualLength: control.value.length,
        },
      };
    };
  }

  private emailValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { email: { value: control.value } };
  }

  private indiaPhoneValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    // India phone number validation: +91 followed by 10 digits
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    const valid = phoneRegex.test(control.value);
    return valid ? null : { indiaPhone: { value: control.value } };
  }

  private atLeastOneContactValidator(group: AbstractControl) {
    const email = group.get('email')?.value;
    const phone = group.get('phone')?.value;
    
    // At least one contact method must be provided
    if (!email && !phone) {
      return { atLeastOneContact: true };
    }
    
    return null;
  }

  // ========================================
  // 🚀 TODO: ADD HELPER METHODS
  // ========================================

  // Helper methods for template
  getOrderId(order: Order): string {
    return order.id?.slice(-6) || 'N/A';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Form validation helpers
  hasError(field: string, errorType: string): boolean {
    const control = this.complaintForm.get(field);
    
    // Handle form-level errors
    if (errorType === 'atLeastOneContact') {
      return this.complaintForm.hasError('atLeastOneContact') && this.complaintForm.touched;
    }
    
    return !!(
      control &&
      control.hasError(errorType) &&
      (control.dirty || control.touched)
    );
  }
  
  hasContactError(): boolean {
    return this.complaintForm.hasError('atLeastOneContact') && this.complaintForm.touched;
  }

  getErrorMessage(field: string): string {
    const control = this.complaintForm.get(field);
    if (control && control.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) {
        return `${this.getFieldName(field)} is required`;
      }
      if (control.errors['minLength']) {
        return `${this.getFieldName(field)} must be at least ${
          control.errors['minLength'].requiredLength
        } characters (current: ${control.errors['minLength'].actualLength})`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['indiaPhone']) {
        return 'Please enter a valid India phone number (+91xxxxxxxxxx)';
      }
    }
    
    // Check for form-level validation errors
    if (this.complaintForm.hasError('atLeastOneContact') && this.complaintForm.touched) {
      if (field === 'email' || field === 'phone') {
        return 'Please provide at least one contact method (email or phone)';
      }
    }
    return '';
  }

  private getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      complaintType: 'Complaint type',
      description: 'Description',
      email: 'Email',
      phone: 'Phone number',
    };
    return fieldNames[field] || field;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
