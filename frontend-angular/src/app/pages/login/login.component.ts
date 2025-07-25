import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, LoginCredentials } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  form: LoginCredentials = {
    email: '',
    password: ''
  };
  isLoading = false;

  onSubmit() {
    if (!this.form.email || !this.form.password) {
      this.toastService.error('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    
    this.apiService.login(this.form)
      .pipe(
        catchError((error) => {
          console.error('Login error:', error);
          this.toastService.error(error.error?.message || error.message || 'Login failed');
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        if (response) {
          this.authService.login(response.user, response.token);
          this.toastService.success('Login successful!');
          
          // Redirect based on role
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/menu']);
          }
        }
      });
  }
}
