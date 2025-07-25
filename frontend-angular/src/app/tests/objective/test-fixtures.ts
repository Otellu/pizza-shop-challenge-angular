// ====================================================================
// 🧪 TEST FIXTURES AND MOCKS - Deterministic Testing Data
// ====================================================================
//
// These fixtures ensure consistent, predictable test data for
// objective evaluation, regardless of candidate implementation style.

import { of, throwError, BehaviorSubject } from 'rxjs';

// ====================================================================
// 📊 MOCK DATA FIXTURES
// ====================================================================

export const MOCK_PIZZAS = [
  {
    id: '1',
    name: 'Margherita Classic',
    price: 12.99,
    isVegetarian: true,
    description: 'Fresh tomatoes, mozzarella, basil',
    imageUrl: '/assets/margherita.jpg',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2', 
    name: 'Pepperoni Supreme',
    price: 15.99,
    isVegetarian: false,
    description: 'Pepperoni, mozzarella, tomato sauce',
    imageUrl: '/assets/pepperoni.jpg',
    createdAt: '2024-01-01T11:00:00Z'
  },
  {
    id: '3',
    name: 'Veggie Delight',
    price: 14.99,
    isVegetarian: true,
    description: 'Bell peppers, mushrooms, onions, olives',
    imageUrl: '/assets/veggie.jpg',
    createdAt: '2024-01-01T12:00:00Z'
  },
  {
    id: '4',
    name: 'Meat Lovers',
    price: 18.99,
    isVegetarian: false,
    description: 'Pepperoni, sausage, bacon, ham',
    imageUrl: '/assets/meat-lovers.jpg',
    createdAt: '2024-01-01T13:00:00Z'
  },
  {
    id: '5',
    name: 'Hawaiian Paradise',
    price: 16.99,
    isVegetarian: false,
    description: 'Ham, pineapple, mozzarella',
    imageUrl: '/assets/hawaiian.jpg',
    createdAt: '2024-01-01T14:00:00Z'
  }
];

export const MOCK_PAGINATED_PIZZA_RESPONSE = {
  pizzas: MOCK_PIZZAS.slice(0, 3),
  pagination: {
    currentPage: 1,
    totalPages: 2,
    totalCount: 5,
    hasNextPage: true,
    hasPreviousPage: false,
    limit: 3
  }
};

export const MOCK_ORDERS = [
  {
    id: 'order-1',
    userId: 'user-1',
    items: [
      { pizzaId: '1', quantity: 2, price: 12.99 },
      { pizzaId: '2', quantity: 1, price: 15.99 }
    ],
    status: 'pending',
    totalAmount: 41.97,
    createdAt: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-15T11:30:00Z'
  },
  {
    id: 'order-2',
    userId: 'user-2', 
    items: [
      { pizzaId: '3', quantity: 1, price: 14.99 }
    ],
    status: 'confirmed',
    totalAmount: 14.99,
    createdAt: '2024-01-15T11:00:00Z',
    estimatedDelivery: '2024-01-15T12:00:00Z'
  },
  {
    id: 'order-3',
    userId: 'user-1',
    items: [
      { pizzaId: '4', quantity: 1, price: 18.99 },
      { pizzaId: '5', quantity: 1, price: 16.99 }
    ],
    status: 'preparing',
    totalAmount: 35.98,
    createdAt: '2024-01-15T11:30:00Z',
    estimatedDelivery: '2024-01-15T12:30:00Z'
  }
];

export const MOCK_COMPLAINT_TYPES = [
  { value: 'Quality Issue', label: 'Quality Issue' },
  { value: 'Delivery Problem', label: 'Delivery Problem' },
  { value: 'Wrong Order', label: 'Wrong Order' },
  { value: 'Other', label: 'Other' }
];

export const MOCK_PRIORITY_LEVELS = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
];

// ====================================================================
// 🔧 MOCK SERVICES
// ====================================================================

export class MockApiService {
  private pizzas$ = new BehaviorSubject(MOCK_PIZZAS);
  private orders$ = new BehaviorSubject(MOCK_ORDERS);

  // Pizza API Methods
  getAllPizzas() {
    return this.pizzas$.asObservable();
  }

  getAllPizzasWithQuery(params: any = {}) {
    let filteredPizzas = [...MOCK_PIZZAS];
    
    // Apply filtering
    if (params.filter === 'veg') {
      filteredPizzas = filteredPizzas.filter(p => p.isVegetarian);
    } else if (params.filter === 'non-veg') {
      filteredPizzas = filteredPizzas.filter(p => !p.isVegetarian);
    }
    
    // Apply search
    if (params.search) {
      filteredPizzas = filteredPizzas.filter(p => 
        p.name.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    // Apply sorting
    if (params.sortBy === 'price') {
      filteredPizzas.sort((a, b) => {
        return params.sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
      });
    } else if (params.sortBy === 'name') {
      filteredPizzas.sort((a, b) => {
        return params.sortOrder === 'desc' ? 
          b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      });
    }
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedPizzas = filteredPizzas.slice(startIndex, startIndex + limit);
    
    return of({
      pizzas: paginatedPizzas,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredPizzas.length / limit),
        totalCount: filteredPizzas.length,
        hasNextPage: startIndex + limit < filteredPizzas.length,
        hasPreviousPage: page > 1,
        limit
      }
    });
  }

  // Order API Methods
  getAllOrders() {
    return this.orders$.asObservable();
  }

  updateOrderStatus(orderId: string, status: string) {
    const orders = this.orders$.value;
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex >= 0) {
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = { ...orders[orderIndex], status };
      this.orders$.next(updatedOrders);
      return of({ success: true, order: updatedOrders[orderIndex] });
    }
    
    return throwError({ message: 'Order not found' });
  }

  // Complaint API Methods
  submitComplaint(orderId: string, complaintData: any) {
    return of({
      success: true,
      complaintId: `complaint-${Date.now()}`,
      message: 'Complaint submitted successfully'
    });
  }

  // Error simulation methods
  simulateNetworkError() {
    return throwError({ message: 'Network connection failed', status: 0 });
  }

  simulateServerError() {
    return throwError({ message: 'Internal server error', status: 500 });
  }

  simulateValidationError() {
    return throwError({ 
      message: 'Validation failed', 
      status: 400,
      errors: { description: 'Description is required' }
    });
  }
}

export class MockCartService {
  private items$ = new BehaviorSubject([]);

  get items() {
    return this.items$.asObservable();
  }

  addToCart(pizza: any) {
    const currentItems = this.items$.value;
    const existingItem = currentItems.find(item => item.id === pizza.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ ...pizza, quantity: 1 });
    }
    
    this.items$.next([...currentItems]);
    return of({ success: true });
  }

  removeFromCart(pizzaId: string) {
    const currentItems = this.items$.value;
    const updatedItems = currentItems.filter(item => item.id !== pizzaId);
    this.items$.next(updatedItems);
    return of({ success: true });
  }

  clearCart() {
    this.items$.next([]);
    return of({ success: true });
  }

  isInCart(pizzaId: string): boolean {
    return this.items$.value.some(item => item.id === pizzaId);
  }
}

export class MockToastService {
  private messages: any[] = [];

  success(message: string) {
    this.messages.push({ type: 'success', message, timestamp: Date.now() });
  }

  error(message: string) {
    this.messages.push({ type: 'error', message, timestamp: Date.now() });
  }

  warning(message: string) {
    this.messages.push({ type: 'warning', message, timestamp: Date.now() });
  }

  info(message: string) {
    this.messages.push({ type: 'info', message, timestamp: Date.now() });
  }

  getMessages() {
    return [...this.messages];
  }

  clearMessages() {
    this.messages = [];
  }
}

// ====================================================================
// 🧪 TEST HELPERS
// ====================================================================

export class TestHelpers {
  
  static createMockComponent(overrides: any = {}) {
    return {
      // Default properties
      searchQuery: '',
      currentFilter: 'all',
      currentSort: 'default',
      currentPage: 1,
      hasMore: true,
      loading: false,
      error: null,
      pizzas: [],
      orders: [],
      isPolling: false,
      complaintForm: null,
      
      // Default methods
      loadPizzas: jasmine.createSpy('loadPizzas'),
      addToCart: jasmine.createSpy('addToCart'),
      onFilterChange: jasmine.createSpy('onFilterChange'),
      onSortChange: jasmine.createSpy('onSortChange'),
      loadMorePizzas: jasmine.createSpy('loadMorePizzas'),
      updateOrderStatus: jasmine.createSpy('updateOrderStatus'),
      submitComplaint: jasmine.createSpy('submitComplaint'),
      startPolling: jasmine.createSpy('startPolling'),
      stopPolling: jasmine.createSpy('stopPolling'),
      ngOnInit: jasmine.createSpy('ngOnInit'),
      ngOnDestroy: jasmine.createSpy('ngOnDestroy'),
      
      // Apply overrides
      ...overrides
    };
  }

  static createMockFormGroup() {
    return {
      get: jasmine.createSpy('get').and.returnValue({
        value: '',
        valid: true,
        errors: null,
        setValue: jasmine.createSpy('setValue'),
        setErrors: jasmine.createSpy('setErrors')
      }),
      valid: true,
      invalid: false,
      value: {},
      reset: jasmine.createSpy('reset'),
      patchValue: jasmine.createSpy('patchValue'),
      setValue: jasmine.createSpy('setValue')
    };
  }

  static createMockHttpResponse(data: any, delay: number = 100) {
    return new Promise(resolve => {
      setTimeout(() => resolve(of(data)), delay);
    });
  }

  static createMockHttpError(error: any, delay: number = 100) {
    return new Promise(resolve => {
      setTimeout(() => resolve(throwError(error)), delay);
    });
  }

  static simulateUserInput(element: HTMLElement, value: string) {
    if (element instanceof HTMLInputElement) {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  static simulateClick(element: HTMLElement) {
    element.dispatchEvent(new Event('click', { bubbles: true }));
  }

  static waitForAsync(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ====================================================================
// 📋 TEST SCENARIOS
// ====================================================================

export const TEST_SCENARIOS = {
  searchTests: [
    { input: 'pizza', expectedResults: 5 },
    { input: 'margherita', expectedResults: 1 },
    { input: 'nonexistent', expectedResults: 0 },
    { input: '', expectedResults: 5 }
  ],
  
  filterTests: [
    { filter: 'all', expectedCount: 5 },
    { filter: 'veg', expectedCount: 2 },
    { filter: 'non-veg', expectedCount: 3 }
  ],
  
  sortTests: [
    { sortBy: 'price', sortOrder: 'asc', firstItem: 'Margherita Classic' },
    { sortBy: 'price', sortOrder: 'desc', firstItem: 'Meat Lovers' },
    { sortBy: 'name', sortOrder: 'asc', firstItem: 'Hawaiian Paradise' }
  ],
  
  errorScenarios: [
    { type: 'network', status: 0, message: 'Network connection failed' },
    { type: 'server', status: 500, message: 'Internal server error' },
    { type: 'validation', status: 400, message: 'Validation failed' }
  ]
};

export default {
  MOCK_PIZZAS,
  MOCK_ORDERS,
  MOCK_PAGINATED_PIZZA_RESPONSE,
  MOCK_COMPLAINT_TYPES,
  MOCK_PRIORITY_LEVELS,
  MockApiService,
  MockCartService,
  MockToastService,
  TestHelpers,
  TEST_SCENARIOS
};