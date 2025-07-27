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
  complaintForm!: FormGroup;

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
    
    if (this.complaintForm.invalid || !this.selectedOrderId) {
      Object.keys(this.complaintForm.controls).forEach(key => {
        this.complaintForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submittingComplaint = true;
    const formData = this.complaintForm.value;
    
    this.apiService.submitComplaint(this.selectedOrderId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Complaint submitted successfully');
          this.resetComplaintForm();
          this.closeComplaintForm();
        },
        error: () => {
          this.toastService.error('Failed to submit complaint. Please try again.');
        },
        complete: () => {
          this.submittingComplaint = false;
        }
      });
  }

  private resetComplaintForm(): void {
    // TODO: Reset form to initial state
    this.complaintForm.reset({
      complaintType: '',
      description: '',
      email: '',
      phone: ''
    });
    Object.keys(this.complaintForm.controls).forEach(key => {
      this.complaintForm.get(key)?.markAsUntouched();
    });
  }

  private minLengthValidator(minLength: number): any {
    // TODO: Create custom validator
    return null;
  }
  
  private initializeForm(): void {
    // TODO: Set up form with validation rules
    this.complaintForm = this.formBuilder.group({
      complaintType: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      email: ['', [Validators.email]],
      phone: ['', [this.indiaPhoneValidator()]]
    }, { validators: this.contactMethodValidator() });

    // Set up validation triggers for contact fields
    this.setupContactValidationTriggers();
  }

  private setupContactValidationTriggers(): void {
    const emailControl = this.complaintForm.get('email');
    const phoneControl = this.complaintForm.get('phone');

    if (emailControl && phoneControl) {
      // When email changes, trigger validation
      emailControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.complaintForm.updateValueAndValidity();
        });

      // When phone changes, trigger validation
      phoneControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.complaintForm.updateValueAndValidity();
        });
    }
  }

  private indiaPhoneValidator() {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (!control.value) return null;
      
      const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
      const valid = phoneRegex.test(control.value.replace(/\s/g, ''));
      
      return valid ? null : { indiaPhone: { value: control.value } };
    };
  }

  private contactMethodValidator() {
    return (formGroup: AbstractControl): {[key: string]: any} | null => {
      const email = formGroup.get('email');
      const phone = formGroup.get('phone');
      
      if (!email || !phone) return null;
      
      const emailValue = email.value?.trim() || '';
      const phoneValue = phone.value?.trim() || '';
      
      // At least one contact method must be provided
      if (emailValue === '' && phoneValue === '') {
        return { contactMethodRequired: true };
      }
      
      return null;
    };
  }

  // Helper methods for template
  complaintTypes = this.getComplaintTypes();

  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.complaintForm.get(fieldName);
    if (!field) return false;
    
    if (errorType) {
      return field.touched && field.hasError(errorType);
    }
    return field.touched && field.invalid;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.complaintForm.get(fieldName);
    if (!field || !field.errors) return '';
    
    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('indiaPhone')) {
      return 'Please enter a valid Indian phone number';
    }
    return '';
  }

  getContactMethodError(): string {
    if (this.complaintForm.hasError('contactMethodRequired')) {
      return 'Please provide at least one contact method (email or phone)';
    }
    return '';
  }

  hasContactError(): boolean {
    return this.complaintForm.hasError('contactMethodRequired') && 
           (this.complaintForm.get('email')?.touched || false) || 
           (this.complaintForm.get('phone')?.touched || false);
  }

  getComplaintTypes() {
    return [
      { value: 'Quality Issue', label: 'Quality Issue' },
      { value: 'Delivery Problem', label: 'Delivery Problem' },
      { value: 'Wrong Order', label: 'Wrong Order' },
      { value: 'Other', label: 'Other' }
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
