import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  
  get toasts() {
    return this.toasts$.asObservable();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private showToast(message: string, type: Toast['type'], duration = 4000) {
    const toast: Toast = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    const currentToasts = this.toasts$.value;
    this.toasts$.next([...currentToasts, toast]);

    // Auto remove toast after duration
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  success(message: string, duration?: number) {
    this.showToast(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.showToast(message, 'error', duration);
  }

  info(message: string, duration?: number) {
    this.showToast(message, 'info', duration);
  }

  warning(message: string, duration?: number) {
    this.showToast(message, 'warning', duration);
  }

  remove(id: string) {
    const currentToasts = this.toasts$.value;
    this.toasts$.next(currentToasts.filter(toast => toast.id !== id));
  }

  clear() {
    this.toasts$.next([]);
  }
}