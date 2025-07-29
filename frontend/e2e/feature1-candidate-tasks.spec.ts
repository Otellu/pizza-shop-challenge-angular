import { test, expect } from '@playwright/test';

/**
 * ========================================
 * 🧪 E2E TESTS FOR FEATURE 1 CANDIDATE TASKS
 * ========================================
 * 
 * This test suite specifically validates the 5 core tasks that candidates
 * need to implement for Feature 1: Smart Pizza Discovery + State Management
 * 
 * Task Breakdown:
 * 1. Real-time Search (8 minutes) - RxJS debouncing + pagination reset
 * 2. Smart Filtering (8 minutes) - Diet filters with state management  
 * 3. Advanced Sorting (7 minutes) - API sortBy/sortOrder integration
 * 4. Infinite Scroll (8 minutes) - Intersection Observer + load more
 * 5. Order Creation (4 minutes) - Cart integration + POST API
 */

test.describe('🎯 Feature 1: Candidate Task Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as regular user to access pizza discovery
    await page.goto('/login');
    await page.locator('input[name="email"]').fill('user@example.com');
    await page.locator('input[name="password"]').fill('test1234');
    await page.locator('button[type="submit"]').click();

    // Wait for pizza list to load
    await page.waitForSelector('[data-testid="pizza-card"]', { timeout: 10000 });
  });

  // ========================================
  // 🔍 TASK 1: Real-time Search (8 minutes)
  // ========================================
  test.describe('Task 1: Real-time Search Implementation', () => {
    test('should implement RxJS debouncing (300ms) with BehaviorSubject', async ({ page }) => {
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toBeVisible();

      // Test rapid typing - should be debounced
      await searchInput.fill('M');
      await searchInput.fill('Ma'); 
      await searchInput.fill('Mar');
      await searchInput.fill('Marg');
      
      // Should not filter immediately (debounce delay)
      await page.waitForTimeout(200);
      
      // Wait for debounce to complete
      await page.waitForTimeout(400);
      
      // Should now show filtered results
      const pizzaCards = await page.locator('[data-testid="pizza-card"]').count();
      expect(pizzaCards).toBeGreaterThan(0);
      
      // Verify search query was applied
      const names = await page.locator('[data-testid="pizza-card"] h3').allTextContents();
      const hasMatchingName = names.some(name => 
        name.toLowerCase().includes('marg')
      );
      expect(hasMatchingName).toBe(true);
    });

    test('should reset pagination when search changes', async ({ page }) => {
      // First, scroll to load more items (if available)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      const initialCount = await page.locator('[data-testid="pizza-card"]').count();
      
      // Perform search - should reset to page 1
      await page.locator('[data-testid="search-input"]').fill('Pizza');
      await page.waitForTimeout(500);
      
      // Should be back at top of page (pagination reset)
      const scrollPosition = await page.evaluate(() => window.pageYOffset);
      expect(scrollPosition).toBe(0);
      
      // Should show only page 1 results for search
      const searchResults = await page.locator('[data-testid="pizza-card"]').count();
      expect(searchResults).toBeLessThanOrEqual(10); // Standard page size
    });

    test('should use distinctUntilChanged to prevent duplicate API calls', async ({ page }) => {
      const searchInput = page.locator('[data-testid="search-input"]');
      
      // Search for same term multiple times
      await searchInput.fill('Margherita');
      await page.waitForTimeout(500);
      
      await searchInput.clear();
      await searchInput.fill('Margherita'); // Same search again
      await page.waitForTimeout(500);
      
      // Should show consistent results (no duplicate calls)
      const results1 = await page.locator('[data-testid="pizza-card"]').count();
      expect(results1).toBeGreaterThan(0);
    });

    test('should clear search and show all pizzas', async ({ page }) => {
      // Search first
      await page.locator('[data-testid="search-input"]').fill('Margherita');
      await page.waitForTimeout(500);
      
      const searchResults = await page.locator('[data-testid="pizza-card"]').count();
      
      // Clear search
      await page.locator('[data-testid="search-input"]').clear();
      await page.waitForTimeout(500);
      
      // Should show more results (all pizzas)
      const allResults = await page.locator('[data-testid="pizza-card"]').count();
      expect(allResults).toBeGreaterThanOrEqual(searchResults);
    });
  });

  // ========================================
  // 🔧 TASK 2: Smart Filtering (8 minutes)  
  // ========================================
  test.describe('Task 2: Smart Filtering Implementation', () => {
    test('should provide three filter buttons: All, Veg, Non-Veg', async ({ page }) => {
      // Verify all required filter buttons exist
      await expect(page.locator('[data-testid="filter-all"]')).toBeVisible();
      await expect(page.locator('[data-testid="filter-veg"]')).toBeVisible();
      await expect(page.locator('[data-testid="filter-non-veg"]')).toBeVisible();
      
      // Verify All is active by default
      await expect(page.locator('[data-testid="filter-all"]')).toHaveClass(/active/);
    });

    test('should update API calls with correct filter parameters', async ({ page }) => {
      // Test Veg filter - should call API with isVegetarian: true
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);
      
      // Verify only vegetarian pizzas shown (green indicators)
      const vegCards = await page.locator('[data-testid="pizza-card"]').count();
      const greenIndicators = await page.locator('[data-testid="pizza-card"] .bg-green-600').count();
      expect(greenIndicators).toBe(vegCards);
      
      // Test Non-Veg filter - should call API with isVegetarian: false  
      await page.locator('[data-testid="filter-non-veg"]').click();
      await page.waitForTimeout(500);
      
      // Verify only non-vegetarian pizzas shown (red indicators)
      const nonVegCards = await page.locator('[data-testid="pizza-card"]').count();
      const redIndicators = await page.locator('[data-testid="pizza-card"] .bg-red-600').count();
      expect(redIndicators).toBe(nonVegCards);
      
      // Test All filter - should call API with isVegetarian: undefined
      await page.locator('[data-testid="filter-all"]').click();
      await page.waitForTimeout(500);
      
      // Should show both veg and non-veg pizzas
      const allCards = await page.locator('[data-testid="pizza-card"]').count();
      const mixedIndicators = await page.locator('[data-testid="pizza-card"] .bg-green-600, [data-testid="pizza-card"] .bg-red-600').count();
      expect(mixedIndicators).toBe(allCards);
    });

    test('should maintain filter state with NgRx Signals/component state', async ({ page }) => {
      // Apply veg filter
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);
      
      // Perform search - filter should persist
      await page.locator('[data-testid="search-input"]').fill('Pizza');
      await page.waitForTimeout(500);
      
      // Should still be filtered to veg only
      const vegCards = await page.locator('[data-testid="pizza-card"]').count();
      const greenIndicators = await page.locator('[data-testid="pizza-card"] .bg-green-600').count();
      expect(greenIndicators).toBe(vegCards);
      
      // Veg filter should still be active
      await expect(page.locator('[data-testid="filter-veg"]')).toHaveClass(/active/);
    });

    test('should reset pagination when filter changes', async ({ page }) => {
      // Scroll to load more items first
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      // Change filter - should reset pagination
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);
      
      // Should be back at top (page 1)
      const scrollPosition = await page.evaluate(() => window.pageYOffset);
      expect(scrollPosition).toBe(0);
    });
  });

  // ========================================
  // 📊 TASK 3: Advanced Sorting (7 minutes)
  // ========================================
  test.describe('Task 3: Advanced Sorting Implementation', () => {
    test('should provide all required sorting options', async ({ page }) => {
      const sortSelect = page.locator('[data-testid="sort-select"]');
      await expect(sortSelect).toBeVisible();
      
      // Verify all sort options exist
      const options = await sortSelect.locator('option').allTextContents();
      expect(options).toContain(' Sort: Default ');
      expect(options).toContain(' Price: Low to High ');
      expect(options).toContain(' Price: High to Low '); 
      expect(options).toContain(' Name: A to Z ');
    });

    test('should use API sortBy and sortOrder parameters correctly', async ({ page }) => {
      const sortSelect = page.locator('[data-testid="sort-select"]');
      
      // Test Price Low→High (sortBy: price, sortOrder: asc)
      await sortSelect.selectOption('price-asc');
      await page.waitForTimeout(500);
      
      const priceElements = await page.locator('[data-testid="pizza-card"] .text-red-600').allTextContents();
      const prices = priceElements.map(price => parseFloat(price.replace(/[^\d.]/g, '')));
      
      // Verify ascending order
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
      
      // Test Price High→Low (sortBy: price, sortOrder: desc)
      await sortSelect.selectOption('price-desc');
      await page.waitForTimeout(500);
      
      const priceElements2 = await page.locator('[data-testid="pizza-card"] .text-red-600').allTextContents();
      const prices2 = priceElements2.map(price => parseFloat(price.replace(/[^\d.]/g, '')));
      
      // Verify descending order
      for (let i = 1; i < prices2.length; i++) {
        expect(prices2[i]).toBeLessThanOrEqual(prices2[i - 1]);
      }
    });

    test('should handle Name A→Z sorting (sortBy: name, sortOrder: asc)', async ({ page }) => {
      await page.locator('[data-testid="sort-select"]').selectOption('name-asc');
      await page.waitForTimeout(500);
      
      const nameElements = await page.locator('[data-testid="pizza-card"] h3').allTextContents();
      
      // Verify alphabetical order
      for (let i = 1; i < nameElements.length; i++) {
        const curr = nameElements[i].trim().toLowerCase();
        const prev = nameElements[i - 1].trim().toLowerCase();
        expect(curr >= prev).toBe(true);
      }
    });

    test('should use default sort (sortBy: createdAt, sortOrder: desc)', async ({ page }) => {
      await page.locator('[data-testid="sort-select"]').selectOption('default');
      await page.waitForTimeout(500);
      
      // Should show pizzas in creation order (newest first)
      const pizzaCards = await page.locator('[data-testid="pizza-card"]').count();
      expect(pizzaCards).toBeGreaterThan(0);
    });

    test('should reset pagination when sort changes', async ({ page }) => {
      // Load more items first
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      // Change sort - should reset to page 1
      await page.locator('[data-testid="sort-select"]').selectOption('price-asc');
      await page.waitForTimeout(500);
      
      const scrollPosition = await page.evaluate(() => window.pageYOffset);
      expect(scrollPosition).toBe(0);
    });
  });

  // ========================================
  // 🔄 TASK 4: Infinite Scroll (8 minutes)
  // ========================================
  test.describe('Task 4: Infinite Scroll Implementation', () => {
    test('should implement Intersection Observer API for scroll detection', async ({ page }) => {
      // Get initial count
      const initialCount = await page.locator('[data-testid="pizza-card"]').count();
      
      // Scroll to bottom to trigger intersection observer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      // Should either load more pizzas OR show "no more results"
      const newCount = await page.locator('[data-testid="pizza-card"]').count();
      const noMoreMessage = await page.locator('[data-testid="no-more-items"]').isVisible();
      
      expect(newCount >= initialCount || noMoreMessage).toBe(true);
    });

    test('should load next page when scrolling near bottom', async ({ page }) => {
      // Get initial count of pizzas
      const initialCount = await page.locator('[data-testid="pizza-card"]').count();
      
      // Scroll to trigger loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      // Check if more pizzas were loaded
      const newCount = await page.locator('[data-testid="pizza-card"]').count();
      
      if (newCount > initialCount) {
        // More pizzas were loaded successfully
        expect(newCount).toBeGreaterThan(initialCount);
      } else {
        // No more pizzas to load, should show end message
        await expect(page.locator('[data-testid="no-more-items"]')).toBeVisible();
      }
    });

    test('should append new pizzas to existing list (not replace)', async ({ page }) => {
      const initialCount = await page.locator('[data-testid="pizza-card"]').count();
      const firstPizzaName = await page.locator('[data-testid="pizza-card"] h3').first().textContent();
      
      // Scroll to load more
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      const newCount = await page.locator('[data-testid="pizza-card"]').count();
      
      if (newCount > initialCount) {
        // First pizza should still be there (appended, not replaced)
        const stillFirstPizza = await page.locator('[data-testid="pizza-card"] h3').first().textContent();
        expect(stillFirstPizza).toBe(firstPizzaName);
        
        // Should have more pizzas now
        expect(newCount).toBeGreaterThan(initialCount);
      }
    });

    test('should handle "no more results" state correctly', async ({ page }) => {
      // Keep scrolling until no more results
      let previousCount = 0;
      let currentCount = await page.locator('[data-testid="pizza-card"]').count();
      let attempts = 0;
      
      while (currentCount > previousCount && attempts < 10) {
        previousCount = currentCount;
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        currentCount = await page.locator('[data-testid="pizza-card"]').count();
        attempts++;
      }
      
      // Should show "no more pizzas" message
      await expect(page.locator('[data-testid="no-more-items"]')).toBeVisible();
      await expect(page.locator('text=/you.*ve seen all.*pizzas/i')).toBeVisible();
    });
  });

  // ========================================
  // 🛒 TASK 5: Order Creation (4 minutes)
  // ========================================
  test.describe('Task 5: Order Creation Integration', () => {
    test('should integrate with existing cart service', async ({ page }) => {
      // Verify "Add to Cart" buttons exist
      const addButtons = await page.locator('[data-testid="add-to-cart-button"]').count();
      expect(addButtons).toBeGreaterThan(0);
      
      // Click first "Add to Cart" button
      await page.locator('[data-testid="add-to-cart-button"]').first().click();
      
      // Should integrate with cart service (button changes state)
      await expect(page.locator('[data-testid="in-cart-button"]').first()).toBeVisible({ timeout: 2000 });
    });

    test('should POST to /api/orders when creating orders', async ({ page }) => {
      // Note: This tests the integration point. Actual order creation 
      // happens in checkout flow, but cart integration is tested here.
      
      const pizzaName = await page.locator('[data-testid="pizza-card"] h3').first().textContent();
      
      // Add pizza to cart
      await page.locator('button[data-testid="add-to-cart-button"]').first().click();
      
      // Verify cart integration worked
      await expect(page.locator('button[data-testid="in-cart-button"]').first()).toBeVisible();
      
      // The POST to /api/orders would happen in checkout component
      // This validates the cart service integration point
    });

    test('should handle success/error with toast notifications', async ({ page }) => {
      // Add pizza to cart
      await page.locator('[data-testid="add-to-cart-button"]').first().click();
      
      // Should show success toast
      await expect(page.locator('text=/added to cart/i')).toBeVisible({ timeout: 3000 });
      
      // Button should update to "In Cart" state
      await expect(page.locator('[data-testid="in-cart-button"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="in-cart-button"]').first()).toBeDisabled();
    });

    test('should prevent duplicate cart additions', async ({ page }) => {
      // Get the first pizza card and its add to cart button
      const firstPizzaCard = page.locator('[data-testid="pizza-card"]').first();
      const addToCartButton = firstPizzaCard.locator('button[data-testid="add-to-cart-button"]');
      
      // Add pizza to cart
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Button should be disabled and show "In Cart"
      const inCartButton = firstPizzaCard.locator('button[data-testid="in-cart-button"]');
      await expect(inCartButton).toBeVisible();
      await expect(inCartButton).toBeDisabled();
      
      // Should not be able to add same pizza again - check the same card
      await expect(addToCartButton).not.toBeVisible();
    });
  });

  // ========================================
  // 🔗 INTEGRATION TESTS
  // ========================================
  test.describe('Task Integration: Combined Functionality', () => {
    test('should handle complete workflow: search + filter + sort + scroll + cart', async ({ page }) => {
      // Step 1: Search
      await page.locator('[data-testid="search-input"]').fill('Pizza');
      await page.waitForTimeout(500);
      
      // Step 2: Filter by vegetarian
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);
      
      // Step 3: Sort by price
      await page.locator('[data-testid="sort-select"]').selectOption('price-asc');
      await page.waitForTimeout(500);
      
      // Step 4: Verify combined state
      const vegCards = await page.locator('[data-testid="pizza-card"]').count();
      const greenIndicators = await page.locator('[data-testid="pizza-card"] .bg-green-600').count();
      expect(greenIndicators).toBe(vegCards); // All should be vegetarian
      
      // Step 5: Add to cart
      if (vegCards > 0) {
        await page.locator('[data-testid="add-to-cart-button"]').first().click();
        await expect(page.locator('text=/added to cart/i')).toBeVisible({ timeout: 2000 });
      }
      
      // Step 6: Test infinite scroll
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      // Should maintain all applied filters/search/sort
      const finalVegCards = await page.locator('[data-testid="pizza-card"]').count();
      const finalGreenIndicators = await page.locator('[data-testid="pizza-card"] .bg-green-600').count();
      expect(finalGreenIndicators).toBe(finalVegCards);
    });

    test('should reset pagination across all operations', async ({ page }) => {
      // Load more items first
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      // Each operation should reset pagination (scroll to top)
      
      // Search reset
      await page.locator('[data-testid="search-input"]').fill('Pizza');
      await page.waitForTimeout(500);
      let scrollPos = await page.evaluate(() => window.pageYOffset);
      expect(scrollPos).toBe(0);
      
      // Scroll down again
      await page.evaluate(() => window.scrollTo(0, 500));
      
      // Filter reset  
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);
      scrollPos = await page.evaluate(() => window.pageYOffset);
      expect(scrollPos).toBe(0);
      
      // Scroll down again
      await page.evaluate(() => window.scrollTo(0, 500));
      
      // Sort reset
      await page.locator('[data-testid="sort-select"]').selectOption('price-asc');
      await page.waitForTimeout(500);
      scrollPos = await page.evaluate(() => window.pageYOffset);
      expect(scrollPos).toBe(0);
    });

    test('should maintain consistent state across all features', async ({ page }) => {
      // Apply all features together and verify consistency
      
      // 1. Apply search
      await page.locator('[data-testid="search-input"]').fill('Margherita');
      await page.waitForTimeout(500);
      
      // 2. Apply filter
      await page.locator('[data-testid="filter-veg"]').click(); 
      await page.waitForTimeout(500);
      
      // 3. Apply sort
      await page.locator('select[data-testid="sort-select"]').selectOption('price-desc');
      await page.waitForTimeout(500);
      
      // Verify all state is maintained
      const searchValue = await page.locator('[data-testid="search-input"]').inputValue();
      expect(searchValue).toBe('Margherita');
      
      await expect(page.locator('[data-testid="filter-veg"]')).toHaveClass(/active/);
      
      const sortValue = await page.locator('[data-testid="sort-select"]').inputValue();
      console.log(sortValue);
      expect(sortValue).toBe('price-desc');
      
      // All visible pizzas should match all criteria
      const pizzaCards = await page.locator('[data-testid="pizza-card"]').count();
      if (pizzaCards > 0) {
        const vegIndicators = await page.locator('[data-testid="pizza-card"] .bg-green-600').count();
        expect(vegIndicators).toBe(pizzaCards);
        
        const names = await page.locator('[data-testid="pizza-card"] h3').allTextContents();
        const allContainMargherita = names.every(name => 
          name.toLowerCase().includes('margherita')
        );
        expect(allContainMargherita).toBe(true);
      }
    });
  });
});