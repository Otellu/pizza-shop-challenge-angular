// pizza-list.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { PizzaListComponent } from './pizza-list.component';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Mock data
const mockPizzas = [
  {
    _id: '1',
    id: '1',
    name: 'Margherita',
    price: 12.99,
    isVegetarian: true,
    description: 'Classic pizza',
    imageUrl: '/assets/pizza1.jpg',
    ingredients: ['Tomato', 'Mozzarella', 'Basil'],
  },
  {
    _id: '2',
    id: '2',
    name: 'Pepperoni',
    price: 14.99,
    isVegetarian: false,
    description: 'Meat lovers',
    imageUrl: '/assets/pizza2.jpg',
    ingredients: ['Tomato', 'Mozzarella', 'Pepperoni'],
  },
  {
    _id: '3',
    id: '3',
    name: 'Veggie Supreme',
    price: 13.99,
    isVegetarian: true,
    description: 'Loaded with veggies',
    imageUrl: '/assets/pizza3.jpg',
    ingredients: ['Tomato', 'Mozzarella', 'Bell Peppers', 'Mushrooms'],
  },
];

describe('PizzaListComponent', () => {
  let component: PizzaListComponent;
  let fixture: ComponentFixture<PizzaListComponent>;
  let mockApiService: jest.Mocked<ApiService>;
  let mockCartService: jest.Mocked<CartService>;
  let mockToastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    // Create mocks
    mockApiService = {
      getAllPizzasWithQuery: jest.fn(),
    } as any;
    
    mockCartService = {
      addToCart: jest.fn(),
      items: jest.fn().mockReturnValue([]),
    } as any;
    
    mockToastService = {
      success: jest.fn(),
      error: jest.fn(),
    } as any;

    // Default mock responses
    mockApiService.getAllPizzasWithQuery.mockReturnValue(
      of({
        pizzas: mockPizzas,
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalCount: 30,
          hasNextPage: true,
          hasPreviousPage: false,
          limit: 10,
        },
      })
    );

    await TestBed.configureTestingModule({
      imports: [PizzaListComponent, CommonModule, FormsModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: CartService, useValue: mockCartService },
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PizzaListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pizzas on init', () => {
    fixture.detectChanges();
    expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalled();
    expect(component.state.pizzas).toEqual(mockPizzas);
  });

  it('should handle search input', () => {
    fixture.detectChanges();
    
    // The performSearch method sets loading to true and calls loadPizzas
    component.performSearch('Margherita');
    expect(component.state.searchQuery).toBe('Margherita');
    // After loadPizzas completes synchronously in test, loading is false again
    expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Margherita' })
    );
  });

  it('should filter vegetarian pizzas', () => {
    fixture.detectChanges();
    component.onFilterChange('veg');
    expect(component.state.currentFilter).toBe('veg');
    expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
      expect.objectContaining({ isVegetarian: true })
    );
  });

  it('should sort pizzas by price', () => {
    fixture.detectChanges();
    const mockEvent = { target: { value: 'price-asc' } } as any;
    component.onSortChange(mockEvent);
    expect(component.state.currentSort).toBe('price-asc');
    expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'price', sortOrder: 'asc' })
    );
  });

  it('should add pizza to cart', () => {
    fixture.detectChanges();
    const pizza = mockPizzas[0];
    component.addToCart(pizza);
    expect(mockCartService.addToCart).toHaveBeenCalledWith(pizza);
    expect(mockToastService.success).toHaveBeenCalledWith('Margherita added to cart!');
  });

  it('should handle API errors', () => {
    // Clear existing mocks and setup error response
    jest.clearAllMocks();
    mockApiService.getAllPizzasWithQuery.mockReturnValue(
      throwError(() => new Error('Network error'))
    );
    
    // Trigger retry which will use the error mock
    component.retryLoad();
    
    // Verify error handling was called
    expect(mockToastService.error).toHaveBeenCalled();
  });

  it('should load more pizzas for infinite scroll', () => {
    fixture.detectChanges();
    component.state.hasMore = true;
    component.loadMorePizzas();
    expect(component.state.currentPage).toBe(2);
    expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });

  it('should get filter buttons', () => {
    const buttons = component.getFilterButtons();
    expect(buttons).toHaveLength(3);
    expect(buttons[0].key).toBe('all');
    expect(buttons[1].key).toBe('veg');
    expect(buttons[2].key).toBe('non-veg');
  });

  it('should get sort options', () => {
    const options = component.getSortOptions();
    expect(options).toHaveLength(4);
    expect(options[0].value).toBe('default');
  });

  it('should clear filters', () => {
    component.state.currentFilter = 'veg';
    component.clearFilters();
    expect(component.state.currentFilter).toBe('all');
  });

  // ========================================
  // 🧪 COMPREHENSIVE FEATURE 1 TESTS
  // Testing the 5 core candidate tasks
  // ========================================

  describe('Feature 1: Real-time Search (Task 1)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should implement RxJS debouncing for search input', fakeAsync(() => {
      // Test the debouncing behavior with BehaviorSubject
      const searchInput = fixture.nativeElement.querySelector('[data-testid="search-input"]');
      
      // Reset call count
      jest.clearAllMocks();
      
      // Rapid search inputs - should be debounced
      component.onSearchChange({ target: { value: 'M' } } as any);
      component.onSearchChange({ target: { value: 'Ma' } } as any);
      component.onSearchChange({ target: { value: 'Mar' } } as any);
      
      // Should not call API immediately
      expect(mockApiService.getAllPizzasWithQuery).not.toHaveBeenCalled();
      
      // Wait for debounce to complete (0ms in test environment)
      tick(100);
      
      // Should call API only once with final value
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledTimes(1);
      expect(component.state.searchQuery).toBe('Mar');
    }));

    it('should reset pagination when search changes', () => {
      component.state.currentPage = 3;
      component.performSearch('Pizza');
      
      expect(component.state.currentPage).toBe(1);
      expect(component.state.pizzas).toEqual([]); // Should clear previous results
    });

    it('should handle empty search gracefully', () => {
      component.performSearch('');
      
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ search: undefined })
      );
    });

    it('should clear search and reset state', () => {
      component.state.searchQuery = 'test';
      component.clearSearch();
      
      // Note: searchQuery will be updated via setupSearch subscription
      expect(component.state.searchQuery).toBe(''); // Gets updated through subscription
    });
  });

  describe('Feature 1: Smart Filtering (Task 2)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should filter vegetarian pizzas correctly', () => {
      component.onFilterChange('veg');
      
      expect(component.state.currentFilter).toBe('veg');
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ isVegetarian: true })
      );
    });

    it('should filter non-vegetarian pizzas correctly', () => {
      component.onFilterChange('non-veg');
      
      expect(component.state.currentFilter).toBe('non-veg');
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ isVegetarian: false })
      );
    });

    it('should show all pizzas when filter is "all"', () => {
      component.onFilterChange('all');
      
      expect(component.state.currentFilter).toBe('all');
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ isVegetarian: undefined })
      );
    });

    it('should maintain filter state across operations', () => {
      component.onFilterChange('veg');
      component.performSearch('Margherita');
      
      // Filter should persist during search
      expect(component.state.currentFilter).toBe('veg');
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ 
          isVegetarian: true,
          search: 'Margherita'
        })
      );
    });

    it('should render filter buttons with correct active states', () => {
      component.state.currentFilter = 'veg';
      const buttons = component.getFilterButtons();
      
      expect(buttons.find(b => b.key === 'veg')?.active).toBe(true);
      expect(buttons.find(b => b.key === 'all')?.active).toBe(false);
      expect(buttons.find(b => b.key === 'non-veg')?.active).toBe(false);
    });
  });

  describe('Feature 1: Advanced Sorting (Task 3)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should sort by price low to high', () => {
      const mockEvent = { target: { value: 'price-asc' } } as any;
      component.onSortChange(mockEvent);
      
      expect(component.state.currentSort).toBe('price-asc');
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ 
          sortBy: 'price',
          sortOrder: 'asc'
        })
      );
    });

    it('should sort by price high to low', () => {
      const mockEvent = { target: { value: 'price-desc' } } as any;
      component.onSortChange(mockEvent);
      
      expect(component.state.currentSort).toBe('price-desc');
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ 
          sortBy: 'price',
          sortOrder: 'desc'
        })
      );
    });

    it('should sort by name A to Z', () => {
      const mockEvent = { target: { value: 'name-asc' } } as any;
      component.onSortChange(mockEvent);
      
      expect(component.state.currentSort).toBe('name-asc');
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ 
          sortBy: 'name',
          sortOrder: 'asc'
        })
      );
    });

    it('should use default sort (createdAt desc)', () => {
      const mockEvent = { target: { value: 'default' } } as any;
      component.onSortChange(mockEvent);
      
      expect(component.state.currentSort).toBe('default');
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ 
          sortBy: 'createdAt',
          sortOrder: 'desc'
        })
      );
    });

    it('should reset pagination when sort changes', () => {
      component.state.currentPage = 3;
      const mockEvent = { target: { value: 'price-asc' } } as any;
      component.onSortChange(mockEvent);
      
      expect(component.state.currentPage).toBe(1);
    });

    it('should provide all required sort options', () => {
      const options = component.getSortOptions();
      
      expect(options).toHaveLength(4);
      expect(options.map(o => o.value)).toEqual([
        'default',
        'price-asc', 
        'price-desc',
        'name-asc'
      ]);
    });
  });

  describe('Feature 1: Infinite Scroll (Task 4)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should load more pizzas when hasMore is true', () => {
      component.state.hasMore = true;
      component.state.loadingMore = false;
      component.state.currentPage = 1;
      
      component.loadMorePizzas();
      
      expect(component.state.currentPage).toBe(2);
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });

    it('should not load more when hasMore is false', () => {
      const initialCallCount = mockApiService.getAllPizzasWithQuery.mock.calls.length;
      component.state.hasMore = false;
      
      component.loadMorePizzas();
      
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledTimes(initialCallCount);
    });

    it('should not load more when already loading', () => {
      const initialCallCount = mockApiService.getAllPizzasWithQuery.mock.calls.length;
      component.state.hasMore = true;
      component.state.loadingMore = true;
      
      component.loadMorePizzas();
      
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenCalledTimes(initialCallCount);
    });

    it('should append new pizzas to existing list', () => {
      const newPizzas = [
        { id: '4', name: 'Hawaiian', price: 15.99, isVegetarian: false, ingredients: ['Ham', 'Pineapple'] }
      ];
      
      // Setup existing pizzas
      component.state.pizzas = mockPizzas;
      
      // Mock API to return new pizzas
      mockApiService.getAllPizzasWithQuery.mockReturnValue(
        of({
          pizzas: newPizzas,
          pagination: {
            currentPage: 2,
            totalPages: 3,
            totalCount: 30,
            hasNextPage: true,
            hasPreviousPage: true,
            limit: 10,
          },
        })
      );
      
      component.loadMorePizzas();
      
      expect(component.state.pizzas).toEqual([...mockPizzas, ...newPizzas]);
    });

    it('should update hasMore state based on pagination', () => {
      mockApiService.getAllPizzasWithQuery.mockReturnValue(
        of({
          pizzas: [],
          pagination: {
            currentPage: 3,
            totalPages: 3,
            totalCount: 30,
            hasNextPage: false,
            hasPreviousPage: true,
            limit: 10,
          },
        })
      );
      
      component.loadMorePizzas();
      
      expect(component.state.hasMore).toBe(false);
    });

    it('should show loading state during infinite scroll', () => {
      component.state.hasMore = true;
      component.loadMorePizzas();
      
      // During the call, loadingMore should be true
      expect(component.state.loadingMore).toBe(true);
    });
  });

  describe('Feature 1: Order Creation (Task 5)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should add pizza to cart successfully', () => {
      const pizza = mockPizzas[0];
      
      component.addToCart(pizza);
      
      expect(mockCartService.addToCart).toHaveBeenCalledWith(pizza);
      expect(mockToastService.success).toHaveBeenCalledWith(`${pizza.name} added to cart!`);
    });

    it('should detect when pizza is already in cart', () => {
      const pizza = mockPizzas[0];
      mockCartService.items.mockReturnValue([pizza]);
      
      const isInCart = component.isInCart(pizza);
      
      expect(isInCart).toBe(true);
    });

    it('should handle cart item matching with _id field', () => {
      const pizza = { ...mockPizzas[0], _id: 'test-id' };
      const cartItem = { ...pizza, id: 'different-id' };
      mockCartService.items.mockReturnValue([cartItem]);
      
      const isInCart = component.isInCart(pizza);
      
      expect(isInCart).toBe(true);
    });

    it('should provide cart integration for order creation', () => {
      // This tests the integration point for order creation
      // The actual order POST would be handled by CartService
      const pizza = mockPizzas[0];
      
      component.addToCart(pizza);
      
      // Verify the cart service integration
      expect(mockCartService.addToCart).toHaveBeenCalledWith(pizza);
    });
  });

  describe('Feature 1: Integration Tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle complete user workflow: filter + sort + search + scroll', () => {
      // Step 1: Filter by vegetarian
      component.onFilterChange('veg');
      expect(component.state.currentFilter).toBe('veg');
      
      // Step 2: Sort by price
      const sortEvent = { target: { value: 'price-asc' } } as any;
      component.onSortChange(sortEvent);
      expect(component.state.currentSort).toBe('price-asc');
      
      // Step 3: Search for specific pizza
      component.performSearch('Margherita');
      expect(component.state.searchQuery).toBe('Margherita');
      
      // Step 4: Load more results
      component.state.hasMore = true;
      component.loadMorePizzas();
      
      // Verify final API call has all parameters
      expect(mockApiService.getAllPizzasWithQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isVegetarian: true,
          sortBy: 'price',
          sortOrder: 'asc',
          search: 'Margherita',
          page: 2,
          limit: 10
        })
      );
    });

    it('should reset pagination when changing filters or search', () => {
      // Set up initial state
      component.state.currentPage = 3;
      
      // Change filter - should reset page
      component.onFilterChange('veg');
      expect(component.state.currentPage).toBe(1);
      
      // Change page again
      component.state.currentPage = 2;
      
      // Change sort - should reset page
      const sortEvent = { target: { value: 'price-asc' } } as any;
      component.onSortChange(sortEvent);
      expect(component.state.currentPage).toBe(1);
      
      // Change page again
      component.state.currentPage = 2;
      
      // Search - should reset page
      component.performSearch('test');
      expect(component.state.currentPage).toBe(1);
    });

    it('should handle error states gracefully across all features', () => {
      const errorResponse = throwError(() => new Error('API Error'));
      mockApiService.getAllPizzasWithQuery.mockReturnValue(errorResponse);
      
      // Test error handling during filter change
      component.onFilterChange('veg');
      expect(mockToastService.error).toHaveBeenCalled();
      
      // Test error handling during search
      component.performSearch('test');
      expect(mockToastService.error).toHaveBeenCalled();
      
      // Test error handling during infinite scroll
      component.loadMorePizzas();
      expect(mockToastService.error).toHaveBeenCalled();
    });
  });
});