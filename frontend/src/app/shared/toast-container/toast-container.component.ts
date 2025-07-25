import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css'
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);
  
  toasts$ = this.toastService.toasts;

  removeToast(id: string) {
    this.toastService.remove(id);
  }

  getToastClasses(type: Toast['type']): string {
    const baseClasses = 'mb-2 p-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-between max-w-sm';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-500 text-white`;
      case 'error':
        return `${baseClasses} bg-red-500 text-white`;
      case 'warning':
        return `${baseClasses} bg-yellow-500 text-white`;
      case 'info':
        return `${baseClasses} bg-blue-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  }
}
