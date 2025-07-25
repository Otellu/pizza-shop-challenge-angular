import { Injectable, computed, signal } from '@angular/core';

export interface User {
  id?: string;
  name: string;
  email: string;
  address?: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private _loading = signal<boolean>(true);

  constructor() {
    this.initializeAuth();
  }

  // Computed signals
  get user() {
    return this._user.asReadonly();
  }

  get token() {
    return this._token.asReadonly();
  }

  get loading() {
    return this._loading.asReadonly();
  }

  get isAuthenticated() {
    return computed(() => !!this._token() && !!this._user());
  }

  get isAdmin() {
    return computed(() => this._user()?.role === 'admin');
  }

  // Methods
  login(userData: User, userToken: string) {
    this._user.set(userData);
    this._token.set(userToken);
    this._loading.set(false);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._loading.set(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private initializeAuth() {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser) as User;
        this._user.set(userData);
        this._token.set(savedToken);
        this._loading.set(false);
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this._loading.set(false);
      }
    } else {
      this._loading.set(false);
    }
  }
}