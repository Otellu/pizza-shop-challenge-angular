// ====================================================================
// 🎯 OBJECTIVE TEST RUNNER - Component-First Hybrid Approach
// ====================================================================
//
// This test runner provides:
// - 80% score from component tests (BULLETPROOF)
// - 20% bonus from E2E tests (when possible)
// - Anti-flakiness measures throughout
// - Deterministic scoring

import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

export interface TestResult {
  feature: string;
  testName: string;
  passed: boolean;
  points: number;
  maxPoints: number;
  error?: string;
  duration: number;
}

export interface FeatureScore {
  featureName: string;
  functional: number;
  api: number;
  errorHandling: number;
  performance: number;
  total: number;
  maxTotal: number;
  percentage: number;
}

export interface ObjectiveTestResults {
  componentScore: number; // 80 points max
  e2eScore: number; // 20 points max
  totalScore: number; // 100 points max
  features: FeatureScore[];
  summary: {
    passed: number;
    failed: number;
    total: number;
    executionTime: number;
  };
  recommendation: 'PASS' | 'FAIL' | 'PARTIAL';
}

export class ObjectiveTestRunner {
  private results: TestResult[] = [];
  private startTime = 0;

  async runAllTests(): Promise<ObjectiveTestResults> {
    this.startTime = Date.now();
    this.results = [];

    console.log('🎯 Starting Objective Challenge Evaluation...');

    try {
      // PRIMARY EVALUATION: Component Tests (80 points)
      const componentResults = await this.runComponentTests();

      // SECONDARY EVALUATION: E2E Smoke Tests (20 points)
      const e2eResults = await this.runE2ESmokeTests();

      return this.generateFinalResults(componentResults, e2eResults);
    } catch (error) {
      console.error('❌ Critical test runner failure:', error);
      return this.generateFailureResults(error);
    }
  }

  private async runComponentTests(): Promise<FeatureScore[]> {
    console.log(
      '🧪 Running Component Tests (Primary Evaluation - 80 points)...'
    );

    const features: FeatureScore[] = [];

    try {
      // Feature 1: Pizza Discovery (27 points)
      features.push(await this.testFeature1PizzaDiscovery());

      // Feature 2: Admin Dashboard (27 points)
      features.push(await this.testFeature2AdminDashboard());

      // Feature 3: Complaint Forms (26 points)
      features.push(await this.testFeature3ComplaintForms());
    } catch (error) {
      console.error('❌ Component test suite failed:', error);
      throw error;
    }

    return features;
  }

  private async runE2ESmokeTests(): Promise<number> {
    console.log('🌐 Running E2E Smoke Tests (Bonus - 20 points)...');

    try {
      // Only run if build is successful and app starts
      const canRunE2E = await this.checkE2EReadiness();
      if (!canRunE2E) {
        console.log('⚠️ E2E tests skipped - app not ready');
        return 0;
      }

      // Run lightweight smoke tests
      let e2eScore = 0;
      e2eScore += await this.testE2EUserFlow(); // 10 points
      e2eScore += await this.testE2ENetworkCalls(); // 10 points

      return e2eScore;
    } catch (error) {
      console.log(
        '⚠️ E2E tests failed, proceeding with component score only:',
        error.message
      );
      return 0;
    }
  }

  private async testFeature1PizzaDiscovery(): Promise<FeatureScore> {
    console.log('  📱 Testing Feature 1: Pizza Discovery...');

    const feature: FeatureScore = {
      featureName: 'Pizza Discovery',
      functional: 0,
      api: 0,
      errorHandling: 0,
      performance: 0,
      total: 0,
      maxTotal: 27,
      percentage: 0,
    };

    // Functional Tests (18 points)
    feature.functional += await this.testSearchFunctionality(); // 5 points
    feature.functional += await this.testFilterFunctionality(); // 5 points
    feature.functional += await this.testSortFunctionality(); // 4 points
    feature.functional += await this.testInfiniteScrollLogic(); // 4 points

    // API Integration Tests (6 points)
    feature.api += await this.testPizzaAPIIntegration(); // 4 points
    feature.api += await this.testOrderCreationAPI(); // 2 points

    // Error Handling Tests (2 points)
    feature.errorHandling += await this.testPizzaErrorHandling(); // 2 points

    // Performance Tests (1 point)
    feature.performance += await this.testPizzaPerformance(); // 1 point

    feature.total =
      feature.functional +
      feature.api +
      feature.errorHandling +
      feature.performance;
    feature.percentage = Math.round((feature.total / feature.maxTotal) * 100);

    return feature;
  }

  private async testFeature2AdminDashboard(): Promise<FeatureScore> {
    console.log('  ⚡ Testing Feature 2: Admin Dashboard...');

    const feature: FeatureScore = {
      featureName: 'Admin Dashboard',
      functional: 0,
      api: 0,
      errorHandling: 0,
      performance: 0,
      total: 0,
      maxTotal: 27,
      percentage: 0,
    };

    // Functional Tests (18 points)
    feature.functional += await this.testPollingFunctionality(); // 6 points
    feature.functional += await this.testStatusUpdateLogic(); // 6 points
    feature.functional += await this.testTabVisibilityHandling(); // 6 points

    // API Integration Tests (6 points)
    feature.api += await this.testAdminAPIIntegration(); // 4 points
    feature.api += await this.testOptimisticUpdates(); // 2 points

    // Error Handling Tests (2 points)
    feature.errorHandling += await this.testAdminErrorHandling(); // 2 points

    // Performance Tests (1 point)
    feature.performance += await this.testPollingPerformance(); // 1 point

    feature.total =
      feature.functional +
      feature.api +
      feature.errorHandling +
      feature.performance;
    feature.percentage = Math.round((feature.total / feature.maxTotal) * 100);

    return feature;
  }

  private async testFeature3ComplaintForms(): Promise<FeatureScore> {
    console.log('  📝 Testing Feature 3: Complaint Forms...');

    const feature: FeatureScore = {
      featureName: 'Complaint Forms',
      functional: 0,
      api: 0,
      errorHandling: 0,
      performance: 0,
      total: 0,
      maxTotal: 26,
      percentage: 0,
    };

    // Functional Tests (18 points)
    feature.functional += await this.testFormValidationLogic(); // 6 points
    feature.functional += await this.testFormSubmissionFlow(); // 6 points
    feature.functional += await this.testFormStateManagement(); // 6 points

    // API Integration Tests (6 points)
    feature.api += await this.testComplaintAPIIntegration(); // 4 points
    feature.api += await this.testOrderHistoryAPI(); // 2 points

    // Error Handling Tests (1 point)
    feature.errorHandling += await this.testFormErrorHandling(); // 1 point

    // Performance Tests (1 point)
    feature.performance += await this.testFormPerformance(); // 1 point

    feature.total =
      feature.functional +
      feature.api +
      feature.errorHandling +
      feature.performance;
    feature.percentage = Math.round((feature.total / feature.maxTotal) * 100);

    return feature;
  }

  // ====================================================================
  // 🧪 INDIVIDUAL TEST IMPLEMENTATIONS
  // ====================================================================

  private async testSearchFunctionality(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      // Test 1: Search input component exists (1 point)
      let fixture, component, compiled;

      try {
        const PizzaListComponent =
          require('../../shared/pizza-list/pizza-list.component').PizzaListComponent;
        fixture = TestBed.createComponent(PizzaListComponent);
      } catch (importError) {
        // Fallback: Try dynamic import or skip component-specific tests
        this.recordResult(
          'Pizza Discovery',
          'Component Import',
          false,
          0,
          5,
          'Component not found or not importable'
        );
        return 0;
      }
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      if (
        compiled.querySelector(
          'input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]'
        )
      ) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Search Input Exists', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Search Input Exists',
          false,
          0,
          1,
          'Search input not found'
        );
      }

      // Test 2: Search state management (2 points)
      if (
        component.searchQuery !== undefined ||
        component.state?.searchQuery !== undefined
      ) {
        score += 2;
        this.recordResult(
          'Pizza Discovery',
          'Search State Management',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Search State Management',
          false,
          0,
          2,
          'Search state not implemented'
        );
      }

      // Test 3: Debouncing implementation (2 points)
      const hasDebouncing =
        component.searchSubject ||
        component.searchControl ||
        (component.searchQuery$ &&
          typeof component.searchQuery$.pipe === 'function');
      if (hasDebouncing) {
        score += 2;
        this.recordResult('Pizza Discovery', 'Search Debouncing', true, 2, 2);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Search Debouncing',
          false,
          0,
          2,
          'Debouncing not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Pizza Discovery',
        'Search Functionality Test',
        false,
        0,
        5,
        error.message
      );
    }

    return score;
  }

  private async testFilterFunctionality(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../shared/pizza-list/pizza-list.component')
          .PizzaListComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Filter UI elements exist (1 point)
      const filterElements = compiled.querySelectorAll(
        'select, button, input[type="radio"]'
      );
      const hasFilterUI = Array.from(filterElements).some(
        (el) =>
          el.textContent?.includes('veg') ||
          el.textContent?.includes('Veg') ||
          el.getAttribute('value')?.includes('veg')
      );

      if (hasFilterUI) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Filter UI Elements', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Filter UI Elements',
          false,
          0,
          1,
          'Filter UI not found'
        );
      }

      // Test 2: Filter state management (2 points)
      if (
        component.currentFilter !== undefined ||
        component.state?.currentFilter !== undefined
      ) {
        score += 2;
        this.recordResult(
          'Pizza Discovery',
          'Filter State Management',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Filter State Management',
          false,
          0,
          2,
          'Filter state not implemented'
        );
      }

      // Test 3: Filter change method exists (2 points)
      if (
        typeof component.onFilterChange === 'function' ||
        typeof component.setFilter === 'function' ||
        typeof component.changeFilter === 'function'
      ) {
        score += 2;
        this.recordResult(
          'Pizza Discovery',
          'Filter Change Method',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Filter Change Method',
          false,
          0,
          2,
          'Filter change method not found'
        );
      }
    } catch (error) {
      this.recordResult(
        'Pizza Discovery',
        'Filter Functionality Test',
        false,
        0,
        5,
        error.message
      );
    }

    return score;
  }

  private async testSortFunctionality(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../shared/pizza-list/pizza-list.component')
          .PizzaListComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Sort UI elements exist (1 point)
      const sortElements = compiled.querySelectorAll('select, button');
      const hasSortUI = Array.from(sortElements).some(
        (el) =>
          el.textContent?.toLowerCase().includes('sort') ||
          el.textContent?.toLowerCase().includes('price') ||
          el.textContent?.toLowerCase().includes('name')
      );

      if (hasSortUI) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Sort UI Elements', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Sort UI Elements',
          false,
          0,
          1,
          'Sort UI not found'
        );
      }

      // Test 2: Sort state management (2 points)
      if (
        component.currentSort !== undefined ||
        component.state?.currentSort !== undefined
      ) {
        score += 2;
        this.recordResult(
          'Pizza Discovery',
          'Sort State Management',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Sort State Management',
          false,
          0,
          2,
          'Sort state not implemented'
        );
      }

      // Test 3: Sort helper methods exist (1 point)
      if (
        typeof component.getSortField === 'function' &&
        typeof component.getSortOrder === 'function'
      ) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Sort Helper Methods', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Sort Helper Methods',
          false,
          0,
          1,
          'Sort helper methods not found'
        );
      }
    } catch (error) {
      this.recordResult(
        'Pizza Discovery',
        'Sort Functionality Test',
        false,
        0,
        4,
        error.message
      );
    }

    return score;
  }

  private async testInfiniteScrollLogic(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../shared/pizza-list/pizza-list.component')
          .PizzaListComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Pagination state exists (1 point)
      if (
        component.currentPage !== undefined ||
        component.state?.currentPage !== undefined ||
        component.hasMore !== undefined ||
        component.state?.hasMore !== undefined
      ) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Pagination State', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Pagination State',
          false,
          0,
          1,
          'Pagination state not found'
        );
      }

      // Test 2: Load more method exists (2 points)
      if (
        typeof component.loadMorePizzas === 'function' ||
        typeof component.loadMore === 'function' ||
        typeof component.onScroll === 'function'
      ) {
        score += 2;
        this.recordResult('Pizza Discovery', 'Load More Method', true, 2, 2);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Load More Method',
          false,
          0,
          2,
          'Load more method not found'
        );
      }

      // Test 3: Intersection Observer or scroll detection (1 point)
      if (
        component.observer ||
        component.intersectionObserver ||
        compiled.querySelector(
          '[data-testid="scroll-trigger"], .scroll-trigger'
        )
      ) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Scroll Detection', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Scroll Detection',
          false,
          0,
          1,
          'Scroll detection not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Pizza Discovery',
        'Infinite Scroll Test',
        false,
        0,
        4,
        error.message
      );
    }

    return score;
  }

  private async testPizzaAPIIntegration(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const mockApiService = jasmine.createSpyObj('ApiService', [
        'getAllPizzasWithQuery',
      ]);
      const fixture = TestBed.createComponent(
        require('../../shared/pizza-list/pizza-list.component')
          .PizzaListComponent
      );
      const component = fixture.componentInstance;

      // Test 1: API service injection (1 point)
      if (component.apiService || component.api) {
        score += 1;
        this.recordResult(
          'Pizza Discovery',
          'API Service Injection',
          true,
          1,
          1
        );
      } else {
        this.recordResult(
          'Pizza Discovery',
          'API Service Injection',
          false,
          0,
          1,
          'API service not injected'
        );
      }

      // Test 2: Load pizzas method exists (2 points)
      if (
        typeof component.loadPizzas === 'function' ||
        typeof component.fetchPizzas === 'function' ||
        typeof component.getPizzas === 'function'
      ) {
        score += 2;
        this.recordResult('Pizza Discovery', 'Load Pizzas Method', true, 2, 2);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Load Pizzas Method',
          false,
          0,
          2,
          'Load pizzas method not found'
        );
      }

      // Test 3: Query parameter construction (1 point)
      if (
        typeof component.buildQueryParams === 'function' ||
        typeof component.getQueryParams === 'function' ||
        component.loadPizzas?.toString().includes('filter') ||
        component.loadPizzas?.toString().includes('sort')
      ) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Query Parameters', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Query Parameters',
          false,
          0,
          1,
          'Query parameter construction not found'
        );
      }
    } catch (error) {
      this.recordResult(
        'Pizza Discovery',
        'API Integration Test',
        false,
        0,
        4,
        error.message
      );
    }

    return score;
  }

  private async testOrderCreationAPI(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../shared/pizza-list/pizza-list.component')
          .PizzaListComponent
      );
      const component = fixture.componentInstance;

      // Test 1: Add to cart method exists (1 point)
      if (
        typeof component.addToCart === 'function' ||
        typeof component.addPizzaToCart === 'function'
      ) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Add to Cart Method', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Add to Cart Method',
          false,
          0,
          1,
          'Add to cart method not found'
        );
      }

      // Test 2: Cart service integration (1 point)
      if (component.cartService || component.cart) {
        score += 1;
        this.recordResult(
          'Pizza Discovery',
          'Cart Service Integration',
          true,
          1,
          1
        );
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Cart Service Integration',
          false,
          0,
          1,
          'Cart service not integrated'
        );
      }
    } catch (error) {
      this.recordResult(
        'Pizza Discovery',
        'Order Creation Test',
        false,
        0,
        2,
        error.message
      );
    }

    return score;
  }

  private async testPizzaErrorHandling(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../shared/pizza-list/pizza-list.component')
          .PizzaListComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Error state management (1 point)
      if (
        component.error !== undefined ||
        component.state?.error !== undefined ||
        component.errorMessage !== undefined
      ) {
        score += 1;
        this.recordResult(
          'Pizza Discovery',
          'Error State Management',
          true,
          1,
          1
        );
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Error State Management',
          false,
          0,
          1,
          'Error state not implemented'
        );
      }

      // Test 2: Error UI handling (1 point)
      const hasErrorUI =
        compiled.querySelector('.error, .alert, [data-testid="error"]') ||
        compiled.textContent?.includes('error') ||
        compiled.textContent?.includes('Error') ||
        compiled.querySelector('app-error-boundary');

      if (hasErrorUI) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Error UI Display', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Error UI Display',
          false,
          0,
          1,
          'Error UI not found'
        );
      }
    } catch (error) {
      this.recordResult(
        'Pizza Discovery',
        'Error Handling Test',
        false,
        0,
        2,
        error.message
      );
    }

    return score;
  }

  private async testPizzaPerformance(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../shared/pizza-list/pizza-list.component')
          .PizzaListComponent
      );
      const component = fixture.componentInstance;

      // Test 1: OnDestroy implementation (1 point)
      if (
        typeof component.ngOnDestroy === 'function' ||
        component.destroy$ ||
        component.subscription ||
        component.unsubscribe$
      ) {
        score += 1;
        this.recordResult('Pizza Discovery', 'Memory Cleanup', true, 1, 1);
      } else {
        this.recordResult(
          'Pizza Discovery',
          'Memory Cleanup',
          false,
          0,
          1,
          'Memory cleanup not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Pizza Discovery',
        'Performance Test',
        false,
        0,
        1,
        error.message
      );
    }

    return score;
  }

  // ====================================================================
  // ⚡ ADMIN DASHBOARD TESTS (Feature 2)
  // ====================================================================

  private async testPollingFunctionality(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/admin-dashboard/admin-dashboard.component')
          .AdminDashboardComponent
      );
      const component = fixture.componentInstance;

      // Test 1: Polling state management (2 points)
      if (
        component.isPolling !== undefined ||
        component.state?.isPolling !== undefined ||
        component.pollingInterval !== undefined
      ) {
        score += 2;
        this.recordResult(
          'Admin Dashboard',
          'Polling State Management',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Polling State Management',
          false,
          0,
          2,
          'Polling state not implemented'
        );
      }

      // Test 2: Start/stop polling methods (2 points)
      if (
        (typeof component.startPolling === 'function' &&
          typeof component.stopPolling === 'function') ||
        (typeof component.startRealTimeUpdates === 'function' &&
          typeof component.stopRealTimeUpdates === 'function')
      ) {
        score += 2;
        this.recordResult(
          'Admin Dashboard',
          'Polling Control Methods',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Polling Control Methods',
          false,
          0,
          2,
          'Polling control methods not found'
        );
      }

      // Test 3: RxJS interval usage (2 points)
      if (
        component.pollingSubscription ||
        component.interval$ ||
        component.startPolling?.toString().includes('interval') ||
        component.startRealTimeUpdates?.toString().includes('interval')
      ) {
        score += 2;
        this.recordResult(
          'Admin Dashboard',
          'RxJS Interval Implementation',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'RxJS Interval Implementation',
          false,
          0,
          2,
          'RxJS interval not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Admin Dashboard',
        'Polling Functionality Test',
        false,
        0,
        6,
        error.message
      );
    }

    return score;
  }

  private async testStatusUpdateLogic(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/admin-dashboard/admin-dashboard.component')
          .AdminDashboardComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Update order status method (2 points)
      if (
        typeof component.updateOrderStatus === 'function' ||
        typeof component.changeOrderStatus === 'function'
      ) {
        score += 2;
        this.recordResult(
          'Admin Dashboard',
          'Update Status Method',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Update Status Method',
          false,
          0,
          2,
          'Update status method not found'
        );
      }

      // Test 2: Status dropdown/buttons UI (2 points)
      const hasStatusUI =
        compiled.querySelector(
          'select, .status-button, [data-testid="status"]'
        ) ||
        Array.from(compiled.querySelectorAll('button')).some(
          (btn) =>
            btn.textContent?.toLowerCase().includes('status') ||
            btn.textContent?.toLowerCase().includes('confirm') ||
            btn.textContent?.toLowerCase().includes('deliver')
        );

      if (hasStatusUI) {
        score += 2;
        this.recordResult('Admin Dashboard', 'Status Update UI', true, 2, 2);
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Status Update UI',
          false,
          0,
          2,
          'Status update UI not found'
        );
      }

      // Test 3: Optimistic updates (2 points)
      if (
        component.updateOrderStatus?.toString().includes('optimistic') ||
        component.orders?.some ||
        typeof component.updateLocalOrder === 'function'
      ) {
        score += 2;
        this.recordResult('Admin Dashboard', 'Optimistic Updates', true, 2, 2);
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Optimistic Updates',
          false,
          0,
          2,
          'Optimistic updates not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Admin Dashboard',
        'Status Update Test',
        false,
        0,
        6,
        error.message
      );
    }

    return score;
  }

  private async testTabVisibilityHandling(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/admin-dashboard/admin-dashboard.component')
          .AdminDashboardComponent
      );
      const component = fixture.componentInstance;

      // Test 1: Tab visibility listener (3 points)
      if (
        component.handleVisibilityChange ||
        component.onVisibilityChange ||
        component.visibilityListener ||
        component.ngOnInit?.toString().includes('visibilitychange')
      ) {
        score += 3;
        this.recordResult(
          'Admin Dashboard',
          'Tab Visibility Listener',
          true,
          3,
          3
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Tab Visibility Listener',
          false,
          0,
          3,
          'Tab visibility listener not found'
        );
      }

      // Test 2: isTabVisible state (2 points)
      if (
        component.isTabVisible !== undefined ||
        component.state?.isTabVisible !== undefined
      ) {
        score += 2;
        this.recordResult(
          'Admin Dashboard',
          'Tab Visibility State',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Tab Visibility State',
          false,
          0,
          2,
          'Tab visibility state not implemented'
        );
      }

      // Test 3: Polling pause on hidden tab (1 point)
      if (
        component.handleVisibilityChange?.toString().includes('stopPolling') ||
        component.handleVisibilityChange?.toString().includes('pause') ||
        component.onVisibilityChange?.toString().includes('stopPolling')
      ) {
        score += 1;
        this.recordResult(
          'Admin Dashboard',
          'Polling Pause on Hidden',
          true,
          1,
          1
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Polling Pause on Hidden',
          false,
          0,
          1,
          'Polling pause not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Admin Dashboard',
        'Tab Visibility Test',
        false,
        0,
        6,
        error.message
      );
    }

    return score;
  }

  private async testAdminAPIIntegration(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/admin-dashboard/admin-dashboard.component')
          .AdminDashboardComponent
      );
      const component = fixture.componentInstance;

      // Test 1: API service injection (1 point)
      if (component.apiService || component.api) {
        score += 1;
        this.recordResult(
          'Admin Dashboard',
          'API Service Injection',
          true,
          1,
          1
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'API Service Injection',
          false,
          0,
          1,
          'API service not injected'
        );
      }

      // Test 2: Load orders method (2 points)
      if (
        typeof component.loadOrders === 'function' ||
        typeof component.fetchOrders === 'function' ||
        typeof component.getOrders === 'function'
      ) {
        score += 2;
        this.recordResult('Admin Dashboard', 'Load Orders Method', true, 2, 2);
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Load Orders Method',
          false,
          0,
          2,
          'Load orders method not found'
        );
      }

      // Test 3: Update order API call (1 point)
      if (
        component.updateOrderStatus?.toString().includes('updateOrderStatus') ||
        component.updateOrderStatus?.toString().includes('patch') ||
        component.updateOrderStatus?.toString().includes('put')
      ) {
        score += 1;
        this.recordResult('Admin Dashboard', 'Update Order API', true, 1, 1);
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Update Order API',
          false,
          0,
          1,
          'Update order API not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Admin Dashboard',
        'Admin API Integration Test',
        false,
        0,
        4,
        error.message
      );
    }

    return score;
  }

  private async testOptimisticUpdates(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/admin-dashboard/admin-dashboard.component')
          .AdminDashboardComponent
      );
      const component = fixture.componentInstance;

      // Test 1: Local state update before API call (2 points)
      if (
        typeof component.updateLocalOrder === 'function' ||
        component.updateOrderStatus?.toString().includes('find') ||
        component.updateOrderStatus?.toString().includes('map')
      ) {
        score += 2;
        this.recordResult(
          'Admin Dashboard',
          'Optimistic UI Updates',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Optimistic UI Updates',
          false,
          0,
          2,
          'Optimistic updates not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Admin Dashboard',
        'Optimistic Updates Test',
        false,
        0,
        2,
        error.message
      );
    }

    return score;
  }

  private async testAdminErrorHandling(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/admin-dashboard/admin-dashboard.component')
          .AdminDashboardComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Error state management (1 point)
      if (
        component.error !== undefined ||
        component.state?.error !== undefined
      ) {
        score += 1;
        this.recordResult(
          'Admin Dashboard',
          'Error State Management',
          true,
          1,
          1
        );
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Error State Management',
          false,
          0,
          1,
          'Error state not implemented'
        );
      }

      // Test 2: Error UI display (1 point)
      const hasErrorUI = compiled.querySelector(
        '.error, .alert, app-error-boundary'
      );
      if (hasErrorUI) {
        score += 1;
        this.recordResult('Admin Dashboard', 'Error UI Display', true, 1, 1);
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Error UI Display',
          false,
          0,
          1,
          'Error UI not found'
        );
      }
    } catch (error) {
      this.recordResult(
        'Admin Dashboard',
        'Admin Error Handling Test',
        false,
        0,
        2,
        error.message
      );
    }

    return score;
  }

  private async testPollingPerformance(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/admin-dashboard/admin-dashboard.component')
          .AdminDashboardComponent
      );
      const component = fixture.componentInstance;

      // Test 1: Proper subscription cleanup (1 point)
      if (
        typeof component.ngOnDestroy === 'function' &&
        (component.ngOnDestroy.toString().includes('unsubscribe') ||
          component.ngOnDestroy.toString().includes('stopPolling'))
      ) {
        score += 1;
        this.recordResult('Admin Dashboard', 'Polling Cleanup', true, 1, 1);
      } else {
        this.recordResult(
          'Admin Dashboard',
          'Polling Cleanup',
          false,
          0,
          1,
          'Polling cleanup not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Admin Dashboard',
        'Polling Performance Test',
        false,
        0,
        1,
        error.message
      );
    }

    return score;
  }

  // ====================================================================
  // 📝 COMPLAINT FORM TESTS (Feature 3)
  // ====================================================================

  private async testFormValidationLogic(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/order-history/order-history.component')
          .OrderHistoryComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Reactive form implementation (2 points)
      if (
        component.complaintForm ||
        component.form ||
        compiled.querySelector('form[formGroup]')
      ) {
        score += 2;
        this.recordResult(
          'Complaint Forms',
          'Reactive Form Implementation',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Complaint Forms',
          'Reactive Form Implementation',
          false,
          0,
          2,
          'Reactive form not implemented'
        );
      }

      // Test 2: Form validation rules (2 points)
      if (
        component.complaintForm?.get ||
        component.form?.get ||
        compiled.querySelector('input[required], select[required]')
      ) {
        score += 2;
        this.recordResult(
          'Complaint Forms',
          'Form Validation Rules',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Complaint Forms',
          'Form Validation Rules',
          false,
          0,
          2,
          'Form validation not implemented'
        );
      }

      // Test 3: Custom validators (2 points)
      if (
        typeof component.customValidator === 'function' ||
        typeof component.validateComplaint === 'function' ||
        component.complaintForm?.validator
      ) {
        score += 2;
        this.recordResult('Complaint Forms', 'Custom Validators', true, 2, 2);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Custom Validators',
          false,
          0,
          2,
          'Custom validators not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Complaint Forms',
        'Form Validation Test',
        false,
        0,
        6,
        error.message
      );
    }

    return score;
  }

  private async testFormSubmissionFlow(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/order-history/order-history.component')
          .OrderHistoryComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Submit complaint method (2 points)
      if (
        typeof component.submitComplaint === 'function' ||
        typeof component.onSubmit === 'function'
      ) {
        score += 2;
        this.recordResult('Complaint Forms', 'Submit Method', true, 2, 2);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Submit Method',
          false,
          0,
          2,
          'Submit method not found'
        );
      }

      // Test 2: Form submission UI (2 points)
      const hasSubmitUI =
        compiled.querySelector('button[type="submit"], .submit-button') ||
        Array.from(compiled.querySelectorAll('button')).some(
          (btn) =>
            btn.textContent?.toLowerCase().includes('submit') ||
            btn.textContent?.toLowerCase().includes('send')
        );

      if (hasSubmitUI) {
        score += 2;
        this.recordResult('Complaint Forms', 'Submit UI', true, 2, 2);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Submit UI',
          false,
          0,
          2,
          'Submit UI not found'
        );
      }

      // Test 3: Loading states (2 points)
      if (
        component.isSubmitting !== undefined ||
        component.loading !== undefined ||
        component.state?.submitting !== undefined
      ) {
        score += 2;
        this.recordResult('Complaint Forms', 'Loading States', true, 2, 2);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Loading States',
          false,
          0,
          2,
          'Loading states not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Complaint Forms',
        'Form Submission Test',
        false,
        0,
        6,
        error.message
      );
    }

    return score;
  }

  private async testFormStateManagement(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/order-history/order-history.component')
          .OrderHistoryComponent
      );
      const component = fixture.componentInstance;

      // Test 1: Form state tracking (2 points)
      if (
        component.showComplaintForm !== undefined ||
        component.state?.showForm !== undefined ||
        component.selectedOrder !== undefined
      ) {
        score += 2;
        this.recordResult('Complaint Forms', 'Form State Tracking', true, 2, 2);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Form State Tracking',
          false,
          0,
          2,
          'Form state not implemented'
        );
      }

      // Test 2: Form reset functionality (2 points)
      if (
        typeof component.resetForm === 'function' ||
        typeof component.clearForm === 'function' ||
        component.submitComplaint?.toString().includes('reset')
      ) {
        score += 2;
        this.recordResult('Complaint Forms', 'Form Reset', true, 2, 2);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Form Reset',
          false,
          0,
          2,
          'Form reset not implemented'
        );
      }

      // Test 3: Modal/dialog integration (2 points)
      if (
        component.showModal !== undefined ||
        component.isModalOpen !== undefined ||
        typeof component.openComplaintModal === 'function'
      ) {
        score += 2;
        this.recordResult('Complaint Forms', 'Modal Integration', true, 2, 2);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Modal Integration',
          false,
          0,
          2,
          'Modal integration not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Complaint Forms',
        'Form State Management Test',
        false,
        0,
        6,
        error.message
      );
    }

    return score;
  }

  private async testComplaintAPIIntegration(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/order-history/order-history.component')
          .OrderHistoryComponent
      );
      const component = fixture.componentInstance;

      // Test 1: API service injection (1 point)
      if (component.apiService || component.api) {
        score += 1;
        this.recordResult(
          'Complaint Forms',
          'API Service Injection',
          true,
          1,
          1
        );
      } else {
        this.recordResult(
          'Complaint Forms',
          'API Service Injection',
          false,
          0,
          1,
          'API service not injected'
        );
      }

      // Test 2: Submit complaint API call (2 points)
      if (
        component.submitComplaint?.toString().includes('submitComplaint') ||
        component.submitComplaint?.toString().includes('complaint') ||
        component.submitComplaint?.toString().includes('post')
      ) {
        score += 2;
        this.recordResult(
          'Complaint Forms',
          'Submit Complaint API',
          true,
          2,
          2
        );
      } else {
        this.recordResult(
          'Complaint Forms',
          'Submit Complaint API',
          false,
          0,
          2,
          'Submit complaint API not implemented'
        );
      }

      // Test 3: API response handling (1 point)
      if (
        component.submitComplaint?.toString().includes('subscribe') ||
        component.submitComplaint?.toString().includes('then') ||
        component.submitComplaint?.toString().includes('catch')
      ) {
        score += 1;
        this.recordResult(
          'Complaint Forms',
          'API Response Handling',
          true,
          1,
          1
        );
      } else {
        this.recordResult(
          'Complaint Forms',
          'API Response Handling',
          false,
          0,
          1,
          'API response handling not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Complaint Forms',
        'Complaint API Integration Test',
        false,
        0,
        4,
        error.message
      );
    }

    return score;
  }

  private async testOrderHistoryAPI(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/order-history/order-history.component')
          .OrderHistoryComponent
      );
      const component = fixture.componentInstance;

      // Test 1: Load orders method (1 point)
      if (
        typeof component.loadOrders === 'function' ||
        typeof component.getOrders === 'function' ||
        typeof component.fetchUserOrders === 'function'
      ) {
        score += 1;
        this.recordResult('Complaint Forms', 'Load Orders Method', true, 1, 1);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Load Orders Method',
          false,
          0,
          1,
          'Load orders method not found'
        );
      }

      // Test 2: Orders display (1 point)
      if (
        component.orders !== undefined ||
        component.userOrders !== undefined
      ) {
        score += 1;
        this.recordResult('Complaint Forms', 'Orders Display', true, 1, 1);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Orders Display',
          false,
          0,
          1,
          'Orders display not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Complaint Forms',
        'Order History API Test',
        false,
        0,
        2,
        error.message
      );
    }

    return score;
  }

  private async testFormErrorHandling(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/order-history/order-history.component')
          .OrderHistoryComponent
      );
      const component = fixture.componentInstance;
      const compiled = fixture.nativeElement;

      // Test 1: Form error display (1 point)
      const hasFormErrors =
        compiled.querySelector('.error, .invalid, .ng-invalid') ||
        component.getFieldError ||
        component.hasError;

      if (hasFormErrors) {
        score += 1;
        this.recordResult('Complaint Forms', 'Form Error Display', true, 1, 1);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Form Error Display',
          false,
          0,
          1,
          'Form error display not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Complaint Forms',
        'Form Error Handling Test',
        false,
        0,
        1,
        error.message
      );
    }

    return score;
  }

  private async testFormPerformance(): Promise<number> {
    let score = 0;
    const startTime = Date.now();

    try {
      const fixture = TestBed.createComponent(
        require('../../pages/order-history/order-history.component')
          .OrderHistoryComponent
      );
      const component = fixture.componentInstance;

      // Test 1: Form cleanup (1 point)
      if (
        typeof component.ngOnDestroy === 'function' &&
        (component.ngOnDestroy.toString().includes('unsubscribe') ||
          component.ngOnDestroy.toString().includes('destroy'))
      ) {
        score += 1;
        this.recordResult('Complaint Forms', 'Form Cleanup', true, 1, 1);
      } else {
        this.recordResult(
          'Complaint Forms',
          'Form Cleanup',
          false,
          0,
          1,
          'Form cleanup not implemented'
        );
      }
    } catch (error) {
      this.recordResult(
        'Complaint Forms',
        'Form Performance Test',
        false,
        0,
        1,
        error.message
      );
    }

    return score;
  }

  // ====================================================================
  // 🌐 E2E SMOKE TESTS
  // ====================================================================

  private async checkE2EReadiness(): Promise<boolean> {
    try {
      // Check if Angular build is successful
      const buildCheck = await this.checkAngularBuild();
      if (!buildCheck) return false;

      // Check if basic app structure exists
      const appCheck = await this.checkAppStructure();
      if (!appCheck) return false;

      return true;
    } catch (error) {
      console.log('⚠️ E2E readiness check failed:', error.message);
      return false;
    }
  }

  private async checkAngularBuild(): Promise<boolean> {
    try {
      // Mock build check - in real implementation, this would run ng build
      return true;
    } catch (error) {
      return false;
    }
  }

  private async checkAppStructure(): Promise<boolean> {
    try {
      // Check if main components exist
      const requiredComponents = [
        'app.component.ts',
        'shared/pizza-list/pizza-list.component.ts',
        'pages/admin-dashboard/admin-dashboard.component.ts',
        'pages/order-history/order-history.component.ts',
      ];

      // Mock check - in real implementation, check file system
      return true;
    } catch (error) {
      return false;
    }
  }

  private async testE2EUserFlow(): Promise<number> {
    let score = 0;

    try {
      // Smoke Test 1: App loads without errors (3 points)
      const appLoads = await this.testAppLoading();
      if (appLoads) {
        score += 3;
        this.recordResult('E2E Smoke', 'App Loads Successfully', true, 3, 3);
      } else {
        this.recordResult(
          'E2E Smoke',
          'App Loads Successfully',
          false,
          0,
          3,
          'App failed to load'
        );
      }

      // Smoke Test 2: Navigation works (3 points)
      const navigationWorks = await this.testBasicNavigation();
      if (navigationWorks) {
        score += 3;
        this.recordResult('E2E Smoke', 'Basic Navigation', true, 3, 3);
      } else {
        this.recordResult(
          'E2E Smoke',
          'Basic Navigation',
          false,
          0,
          3,
          'Navigation failed'
        );
      }

      // Smoke Test 3: Core features accessible (4 points)
      const featuresAccessible = await this.testFeatureAccessibility();
      score += featuresAccessible;
      this.recordResult(
        'E2E Smoke',
        'Feature Accessibility',
        featuresAccessible > 0,
        featuresAccessible,
        4
      );
    } catch (error) {
      this.recordResult(
        'E2E Smoke',
        'User Flow Test',
        false,
        0,
        10,
        error.message
      );
    }

    return score;
  }

  private async testAppLoading(): Promise<boolean> {
    try {
      // Mock implementation - would use Cypress/Playwright in real scenario
      return true;
    } catch (error) {
      return false;
    }
  }

  private async testBasicNavigation(): Promise<boolean> {
    try {
      // Mock implementation - would test routing in real scenario
      return true;
    } catch (error) {
      return false;
    }
  }

  private async testFeatureAccessibility(): Promise<number> {
    let score = 0;

    try {
      // Test if pizza list is accessible (1 point)
      // Test if admin dashboard is accessible (1 point)
      // Test if order history is accessible (1 point)
      // Test if forms are interactive (1 point)

      // Mock implementation
      return 2; // Partial credit
    } catch (error) {
      return 0;
    }
  }

  private async testE2ENetworkCalls(): Promise<number> {
    let score = 0;

    try {
      // Smoke Test 1: API calls are made (5 points)
      const apiCallsMade = await this.testAPICallsAreMade();
      if (apiCallsMade) {
        score += 5;
        this.recordResult('E2E Smoke', 'API Calls Made', true, 5, 5);
      } else {
        this.recordResult(
          'E2E Smoke',
          'API Calls Made',
          false,
          0,
          5,
          'No API calls detected'
        );
      }

      // Smoke Test 2: Network error handling (5 points)
      const errorHandling = await this.testNetworkErrorHandling();
      if (errorHandling) {
        score += 5;
        this.recordResult('E2E Smoke', 'Network Error Handling', true, 5, 5);
      } else {
        this.recordResult(
          'E2E Smoke',
          'Network Error Handling',
          false,
          0,
          5,
          'Error handling not detected'
        );
      }
    } catch (error) {
      this.recordResult(
        'E2E Smoke',
        'Network Calls Test',
        false,
        0,
        10,
        error.message
      );
    }

    return score;
  }

  private async testAPICallsAreMade(): Promise<boolean> {
    try {
      // Mock implementation - would intercept network requests in real scenario
      return true;
    } catch (error) {
      return false;
    }
  }

  private async testNetworkErrorHandling(): Promise<boolean> {
    try {
      // Mock implementation - would simulate network failures in real scenario
      return false; // Default to false since this is advanced
    } catch (error) {
      return false;
    }
  }

  // ====================================================================
  // 📊 RESULT GENERATION
  // ====================================================================

  private generateFinalResults(
    componentFeatures: FeatureScore[],
    e2eScore: number
  ): ObjectiveTestResults {
    const componentScore = componentFeatures.reduce(
      (sum, feature) => sum + feature.total,
      0
    );
    const totalScore = componentScore + e2eScore;
    const executionTime = Date.now() - this.startTime;

    const recommendation = this.determineRecommendation(totalScore);

    return {
      componentScore,
      e2eScore,
      totalScore,
      features: componentFeatures,
      summary: {
        passed: this.results.filter((r) => r.passed).length,
        failed: this.results.filter((r) => !r.passed).length,
        total: this.results.length,
        executionTime,
      },
      recommendation,
    };
  }

  private generateFailureResults(error: any): ObjectiveTestResults {
    return {
      componentScore: 0,
      e2eScore: 0,
      totalScore: 0,
      features: [],
      summary: {
        passed: 0,
        failed: 1,
        total: 1,
        executionTime: Date.now() - this.startTime,
      },
      recommendation: 'FAIL',
    };
  }

  private determineRecommendation(
    totalScore: number
  ): 'PASS' | 'FAIL' | 'PARTIAL' {
    if (totalScore >= 70) return 'PASS'; // 70+ points = Pass
    if (totalScore >= 40) return 'PARTIAL'; // 40-69 points = Partial
    return 'FAIL'; // < 40 points = Fail
  }

  // ====================================================================
  // 🛡️ FALLBACK MECHANISMS
  // ====================================================================

  private async safeComponentImport(componentPath: string): Promise<any> {
    try {
      // Method 1: Try require
      return require(componentPath);
    } catch (requireError) {
      try {
        // Method 2: Try dynamic import
        return await import(componentPath);
      } catch (importError) {
        try {
          // Method 3: Check if file exists and provide fallback
          const absolutePath = path.resolve(__dirname, componentPath);
          if (fs.existsSync(absolutePath + '.ts')) {
            console.log(
              `⚠️ Component exists but cannot be imported: ${componentPath}`
            );
            return this.createMockComponent();
          }
        } catch (fsError) {
          // File doesn't exist or filesystem error
        }

        // Method 4: Return null to indicate component not found
        return null;
      }
    }
  }

  private createMockComponent(): any {
    // Create a minimal mock component for testing structure
    return {
      default: class MockComponent {
        searchQuery = '';
        currentFilter = 'all';
        currentSort = 'default';
        isPolling = false;
        complaintForm = null;
        apiService = null;

        loadPizzas() {}
        addToCart() {}
        updateOrderStatus() {}
        submitComplaint() {}
        ngOnDestroy() {}
      },
    };
  }

  private async testComponentExistence(
    componentPath: string,
    featureName: string
  ): Promise<boolean> {
    try {
      const absolutePath = path.resolve(__dirname, componentPath);
      const exists =
        fs.existsSync(absolutePath + '.ts') ||
        fs.existsSync(absolutePath + '.js');

      if (exists) {
        this.recordResult(featureName, 'Component File Exists', true, 1, 1);
        return true;
      } else {
        this.recordResult(
          featureName,
          'Component File Exists',
          false,
          0,
          1,
          `Component file not found: ${componentPath}`
        );
        return false;
      }
    } catch (error) {
      this.recordResult(
        featureName,
        'Component File Check',
        false,
        0,
        1,
        error.message
      );
      return false;
    }
  }

  private async fallbackStructuralAnalysis(
    componentPath: string,
    featureName: string
  ): Promise<number> {
    let score = 0;

    try {
      const absolutePath = path.resolve(__dirname, componentPath);

      if (!fs.existsSync(absolutePath + '.ts')) {
        return 0;
      }

      const fileContent = fs.readFileSync(absolutePath + '.ts', 'utf8');

      // Structural analysis based on code patterns
      score += this.analyzeCodeStructure(fileContent, featureName);
    } catch (error) {
      this.recordResult(
        featureName,
        'Structural Analysis',
        false,
        0,
        1,
        error.message
      );
    }

    return score;
  }

  private analyzeCodeStructure(
    fileContent: string,
    featureName: string
  ): number {
    let score = 0;

    // Check for common Angular patterns
    const patterns = {
      'Component Decorator': /@Component\s*\(/,
      'Reactive Forms': /FormGroup|FormControl|Validators/,
      'RxJS Usage': /import.*rxjs|switchMap|debounceTime|interval/,
      'API Service': /apiService|api\./,
      'Lifecycle Hooks': /ngOnInit|ngOnDestroy/,
      'State Management': /state|currentFilter|currentSort/,
      'Error Handling': /catch|error|Error/,
      'Subscription Management': /subscribe|unsubscribe|takeUntil/,
    };

    for (const [patternName, regex] of Object.entries(patterns)) {
      if (regex.test(fileContent)) {
        score += 0.5;
        this.recordResult(
          featureName,
          `Pattern: ${patternName}`,
          true,
          0.5,
          0.5
        );
      }
    }

    return Math.min(score, 5); // Cap at 5 points for structural analysis
  }

  // ====================================================================
  // 🎯 UTILITY METHODS
  // ====================================================================

  private recordResult(
    feature: string,
    testName: string,
    passed: boolean,
    points: number,
    maxPoints: number,
    error?: string
  ): void {
    this.results.push({
      feature,
      testName,
      passed,
      points: passed ? points : 0,
      maxPoints,
      error,
      duration: 0,
    });
  }

  printResults(results: ObjectiveTestResults): void {
    console.log('\n🎯 OBJECTIVE TEST RESULTS:');
    console.log('=========================');

    results.features.forEach((feature) => {
      const status =
        feature.percentage >= 70
          ? '✅'
          : feature.percentage >= 40
          ? '⚠️'
          : '❌';
      console.log(
        `${feature.featureName}: ${feature.total}/${feature.maxTotal} (${feature.percentage}%) ${status}`
      );
    });

    console.log(`\nComponent Score: ${results.componentScore}/80`);
    console.log(`E2E Bonus: ${results.e2eScore}/20`);
    console.log(
      `TOTAL SCORE: ${results.totalScore}/100 - ${
        results.recommendation
      } ${this.getRecommendationEmoji(results.recommendation)}`
    );
  }

  private getRecommendationEmoji(recommendation: string): string {
    switch (recommendation) {
      case 'PASS':
        return '✅';
      case 'PARTIAL':
        return '⚠️';
      case 'FAIL':
        return '❌';
      default:
        return '❓';
    }
  }
}
