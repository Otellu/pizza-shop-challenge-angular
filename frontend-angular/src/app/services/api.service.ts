import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pizza } from './cart.service';
import { User } from './auth.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  address: string;
  password: string;
  role: 'user' | 'admin';
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Order {
  id: string;
  items: Pizza[];
  totalAmount: number;
  customerInfo: {
    name: string;
    address: string;
  };
  user?: {
    name: string;
    email: string;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: Pizza[];
  customerInfo: {
    name: string;
    address: string;
  };
}

export interface PizzaQueryParams {
  filter?: 'veg' | 'non-veg' | 'all';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Auth API
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, { headers });
  }

  signup(userData: SignupData): Observable<LoginResponse> {
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/signup`, userData, { headers });
  }

  // Pizza API
  getAllPizzas(): Observable<Pizza[]> {
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.get<Pizza[]>(`${this.apiUrl}/pizzas`, { headers });
  }

  getAllPizzasWithQuery(queryParams: PizzaQueryParams): Observable<{
    pizzas: Pizza[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let params = new HttpParams();
    
    if (queryParams.filter) {
      params = params.append('filter', queryParams.filter);
    }
    if (queryParams.sortOrder) {
      params = params.append('sortOrder', queryParams.sortOrder);
    }
    if (queryParams.page) {
      params = params.append('page', queryParams.page.toString());
    }
    if (queryParams.limit) {
      params = params.append('limit', queryParams.limit.toString());
    }

    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.get<{
      pizzas: Pizza[];
      total: number;
      page: number;
      totalPages: number;
    }>(`${this.apiUrl}/pizzas`, { params, headers });
  }

  // Order API
  createOrder(orderData: CreateOrderData): Observable<Order> {
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.post<Order>(`${this.apiUrl}/orders`, orderData, { headers });
  }

  getUserOrders(): Observable<Order[]> {
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.get<Order[]>(`${this.apiUrl}/orders/mine`, { headers });
  }

  getAllOrders(): Observable<Order[]> {
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders`, { headers });
  }

  // Admin API
  confirmOrder(orderId: string): Observable<Order> {
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.patch<Order>(`${this.apiUrl}/admin/orders/${orderId}/confirm`, {}, { headers });
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.patch<Order>(`${this.apiUrl}/admin/orders/${orderId}/status`, { status }, { headers });
  }
}