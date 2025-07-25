import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, SignupData } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoaderComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  form: SignupData = {
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  };
  isLoading = false;

  onSubmit() {
    if (!this.form.name || !this.form.email || !this.form.address || !this.form.password) {
      this.toastService.error('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    
    this.apiService.signup(this.form)
      .pipe(
        catchError((error) => {
          this.toastService.error(error.message || 'Signup failed');
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        if (response) {
          this.authService.login(response.user, response.token);
          this.toastService.success('Signup successful!');
          
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
