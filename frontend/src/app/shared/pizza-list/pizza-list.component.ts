import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, debounceTime, distinctUntilChanged, switchMap, catchError, finalize } from 'rxjs';
import { of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService, PizzaQueryParams } from '../../services/api.service';
import { CartService, Pizza } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { FilterButtonComponent } from '../filter-button/filter-button.component';
import { LoaderComponent } from '../loader/loader.component';

// ====================================================================
// 🎯 SENIOR CHALLENGE: Smart Pizza Discovery + State Management
// Time: ~35 minutes | Difficulty: Senior Level
// 
// Your implementation will be evaluated on:
// - Code quality and organization
// - Performance considerations  
// - Error handling
// - User experience
// ====================================================================

type FilterType = 'all' | 'veg' | 'non-veg';
type SortType = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

interface PizzaListState {
  pizzas: Pizza[];
  currentFilter: FilterType;
  currentSort: SortType;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  searchQuery: string;
  error: string | null;
}

@Component({
  selector: 'app-pizza-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterButtonComponent, LoaderComponent],
  templateUrl: './pizza-list.component.html',
  styleUrl: './pizza-list.component.css'
})
export class PizzaListComponent implements OnInit, OnDestroy {
  @ViewChild('loadTrigger', { static: false }) loadTrigger!: ElementRef;

  private apiService = inject(ApiService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();
  private searchSubject = new BehaviorSubject<string>('');
  private intersectionObserver?: IntersectionObserver;

  // State management
  state: PizzaListState = {
    pizzas: [],
    currentFilter: 'all',
    currentSort: 'default',
    currentPage: 1,
    totalPages: 1,
    hasMore: true,
    loading: false,
    loadingMore: false,
    searchQuery: '',
    error: null
  };

  ngOnInit() {
    // TODO (5 min): Set up search functionality with debouncing
    // TODO (3 min): Initialize intersection observer for infinite scroll
    // TODO (2 min): Load initial pizza data
    
    this.basicSetup(); // Enhance this implementation
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupSearch(): void {
    // TODO: Implement search with RxJS
    // Requirements:
    // - Debounce user input
    // - Cancel previous requests
    // - Reset pagination on search
  }

  private setupInfiniteScroll(): void {
    // TODO: Implement infinite scroll
    // Requirements:
    // - Use Intersection Observer API
    // - Trigger when user scrolls near bottom
    // - Prevent duplicate requests
  }

  loadPizzas(reset = false): void {
    // TODO: Implement pizza loading with pagination
    // Requirements:
    // - Build query params from component state
    // - Handle loading states properly
    // - Append or replace results based on reset flag
    // - Update pagination state
    
    // Basic implementation - enhance this
    this.apiService.getAllPizzas().subscribe(
      pizzas => this.state.pizzas = pizzas,
      error => console.error(error)
    );
  }

  private getSortField(sortType: SortType): string {
    // TODO: Map sort type to API field name
    return 'createdAt';
  }

  private getSortOrder(sortType: SortType): 'asc' | 'desc' {
    // TODO: Extract sort direction from sort type
    return 'desc';
  }

  private loadMorePizzas(): void {
    // TODO: Implement pagination logic
    // Requirements:
    // - Check if more pages available
    // - Increment page counter
    // - Append results to existing list
  }

  onFilterChange(filter: FilterType): void {
    // TODO: Handle filter changes
  }

  onSortChange(event: Event): void {
    // TODO: Handle sort changes
  }

  onSearchChange(event: Event): void {
    // TODO: Handle search input changes
  }

  addToCart(pizza: Pizza): void {
    // TODO: Add pizza to cart with feedback
    this.cartService.addToCart(pizza);
  }

  isInCart(pizza: Pizza): boolean {
    // Match React's logic - check both _id and id fields
    const pizzaId = (pizza as any)._id || pizza.id;
    return this.cartService.items().some(item => {
      const itemId = (item as any)._id || item.id;
      return itemId === pizzaId;
    });
  }

  // Utility methods
  getSortOptions() {
    return [
      { value: 'default', label: 'Sort: Default' },
      { value: 'price-asc', label: 'Price: Low to High' },
      { value: 'price-desc', label: 'Price: High to Low' },
      { value: 'name-asc', label: 'Name: A to Z' }
    ];
  }

  getFilterButtons() {
    return [
      { key: 'all' as FilterType, text: 'All', active: this.state.currentFilter === 'all' },
      { key: 'veg' as FilterType, text: 'Veg', active: this.state.currentFilter === 'veg' },
      { key: 'non-veg' as FilterType, text: 'Non-Veg', active: this.state.currentFilter === 'non-veg' }
    ];
  }

  getPizzaImage(pizza: Pizza): string {
    if (pizza.image && pizza.image.startsWith('http')) {
      return pizza.image;
    }
    if (pizza.image) {
      return `./${pizza.image}`;
    }
    if (pizza.imageUrl && pizza.imageUrl.startsWith('http')) {
      return pizza.imageUrl;
    }
    if (pizza.imageUrl) {
      return `./${pizza.imageUrl}`;
    }
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80";
  }

  // Performance optimization for *ngFor
  trackByPizzaId(index: number, pizza: Pizza): string {
    return pizza.id;
  }
  
  // Basic setup method - candidates should enhance this
  private basicSetup(): void {
    this.setupSearch();
    this.loadPizzas(true);
    setTimeout(() => this.setupInfiniteScroll(), 1000);
  }

  clearFilters(): void {
    // TODO: Reset all filters and search
  }

  // Image error handler
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80';
  }
}
