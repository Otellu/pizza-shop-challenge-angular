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

// TODO: CANDIDATE TASK - Implement filtering, sorting, and infinite scroll
//
// Current implementation only fetches all pizzas once
// You need to implement:
// 1. State management for filters and sorting
// 2. API calls with query parameters
// 3. Infinite scroll with pagination
// 4. Loading states and error handling
//
// Expected features:
// - Filter by: All, Veg, Non-Veg
// - Sort by: Default, Price (Low to High), Price (High to Low), Name
// - Search functionality
// - Infinite scroll loading
// - Loading spinners
// - Error handling

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
    this.setupSearch();
    this.loadPizzas(true);
    
    // TODO: Add state for filters, sorting, pagination, loading, etc.
    
    // Setup intersection observer for infinite scroll
    setTimeout(() => {
      this.setupInfiniteScroll();
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.state.searchQuery = query;
      this.loadPizzas(true);
    });
  }

  private setupInfiniteScroll() {
    if (!this.loadTrigger) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && this.state.hasMore && !this.state.loading && !this.state.loadingMore) {
          this.loadMorePizzas();
        }
      },
      { threshold: 0.1 }
    );

    this.intersectionObserver.observe(this.loadTrigger.nativeElement);
  }

  loadPizzas(reset = false) {
    if (reset) {
      this.state.currentPage = 1;
      this.state.pizzas = [];
      this.state.loading = true;
    } else {
      this.state.loadingMore = true;
    }

    // TODO: Replace this basic fetch with comprehensive filtering/sorting/pagination
    // Start with simple API call to test
    this.apiService.getAllPizzas()
      .pipe(
        catchError((error) => {
          console.error('Failed to load pizzas:', error);
          const errorMessage = error.error?.message || error.message || 'Failed to load pizzas';
          this.state.error = errorMessage;
          this.toastService.error(errorMessage);
          return of([]);
        }),
        finalize(() => {
          this.state.loading = false;
          this.state.loadingMore = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((pizzas) => {
        this.state.pizzas = pizzas;
        this.state.totalPages = 1;
        this.state.hasMore = false;
        this.state.error = null;
        console.log('Loaded pizzas:', pizzas);
      });
  }

  // TODO: Implement fetchPizzas with query parameters

  private loadMorePizzas() {
    if (this.state.hasMore && !this.state.loadingMore) {
      this.state.currentPage++;
      this.loadPizzas(false);
    }
  }

  // Filter methods
  onFilterChange(filter: FilterType) {
    if (this.state.currentFilter !== filter) {
      this.state.currentFilter = filter;
      this.loadPizzas(true);
    }
  }

  // Sort methods
  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const sort = select.value as SortType;
    if (this.state.currentSort !== sort) {
      this.state.currentSort = sort;
      this.loadPizzas(true);
    }
  }

  // Search methods
  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  // Cart methods
  addToCart(pizza: Pizza) {
    this.cartService.addToCart(pizza);
    this.toastService.success(`${pizza.name} added to cart!`);
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

  // Clear filters method for template
  clearFilters() {
    this.onFilterChange('all');
    this.searchSubject.next('');
  }

  // Image error handler
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80';
  }
}
