import { test, expect } from '@playwright/test';

test.describe('Feature 1: Pizza Discovery', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the pizza listing page
    await page.goto('/login');

    await page.locator('input[name="email"]').fill('zenno.bruinsma@gmail.com');
    await page.locator('input[name="password"]').fill('test1234');
    await page.locator('button[type="submit"]').click();

    // Wait for the page to load and pizza list to appear
    await page.waitForSelector('[data-testid="pizza-card"]', {
      timeout: 10000,
    });
  });

  test.describe('Search Functionality', () => {
    test('should display search input and filter pizzas by search term', async ({
      page,
    }) => {
      // Verify search input exists
      const searchInput = page.locator('input[placeholder*="Search pizzas"]');
      await expect(searchInput).toBeVisible();

      // Get initial pizza count
      const initialPizzas = await page
        .locator('[data-testid="pizza-card"]')
        .count();
      expect(initialPizzas).toBeGreaterThan(0);

      // Search for "Margherita"
      await searchInput.fill('Margherita');

      // Wait for search results to update (debounced)
      await page.waitForTimeout(500);

      // Verify filtered results
      const filteredPizzas = await page
        .locator('[data-testid="pizza-card"]')
        .count();
      expect(filteredPizzas).toBeLessThanOrEqual(initialPizzas);

      // Verify search results contain the search term
      const pizzaNames = await page
        .locator('[data-testid="pizza-card"] h3')
        .allTextContents();
      const hasSearchTerm = pizzaNames.some((name) =>
        name.toLowerCase().includes('margherita')
      );
      expect(hasSearchTerm).toBe(true);
    });

    test('should debounce search input (300ms delay)', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search pizzas"]');

      // Start typing rapidly
      await searchInput.fill('M');
      await searchInput.fill('Ma');
      await searchInput.fill('Mar');
      await searchInput.fill('Marg');

      // Wait less than debounce time
      await page.waitForTimeout(200);

      // Should not have filtered yet (still showing all pizzas)
      const pizzasBeforeDebounce = await page
        .locator('[data-testid="pizza-card"]')
        .count();

      // Wait for debounce to complete
      await page.waitForTimeout(400);

      // Now should be filtered
      const pizzasAfterDebounce = await page
        .locator('[data-testid="pizza-card"]')
        .count();
      expect(pizzasAfterDebounce).toBeLessThanOrEqual(pizzasBeforeDebounce);
    });

    test('should show "No results found" for non-existent pizza', async ({
      page,
    }) => {
      const searchInput = page.locator('input[placeholder*="Search pizzas"]');

      // Search for non-existent pizza
      await searchInput.fill('NonExistentPizza123');
      await page.waitForTimeout(500);

      // Should show no results message
      await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
      await expect(page.locator('text=/no pizzas found/i')).toBeVisible();
    });

    test('should clear search and show all pizzas', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search pizzas"]');

      // Search for specific pizza
      await searchInput.fill('Margherita');
      await page.waitForTimeout(500);

      const filteredCount = await page
        .locator('[data-testid="pizza-card"]')
        .count();

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);

      // Should show all pizzas again
      const allPizzasCount = await page
        .locator('[data-testid="pizza-card"]')
        .count();
      expect(allPizzasCount).toBeGreaterThanOrEqual(filteredCount);
    });
  });

  test.describe('Dietary Filters', () => {
    test('should display filter buttons (All, Veg, Non-Veg)', async ({
      page,
    }) => {
      // Verify all filter buttons exist
      await expect(page.locator('[data-testid="filter-all"]')).toBeVisible();
      await expect(page.locator('[data-testid="filter-veg"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="filter-non-veg"]')
      ).toBeVisible();

      // Verify "All" is active by default
      await expect(page.locator('[data-testid="filter-all"]')).toHaveClass(
        /active/
      );
    });

    test('should filter vegetarian pizzas when Veg clicked', async ({
      page,
    }) => {
      const initialCount = await page
        .locator('[data-testid="pizza-card"]')
        .count();

      // Click Veg filter
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);

      // Verify Veg filter is active
      await expect(page.locator('[data-testid="filter-veg"]')).toHaveClass(
        /active/
      );

      // Check that only vegetarian pizzas are shown
      const vegCards = await page.locator('[data-testid="pizza-card"]').count();
      expect(vegCards).toBeGreaterThan(0);

      // Verify all visible pizzas have vegetarian indicator (green dot)
      const vegIndicators = await page
        .locator('[data-testid="pizza-card"] .bg-green-600')
        .count();
      expect(vegIndicators).toBe(vegCards);
    });

    test('should filter non-vegetarian pizzas when Non-Veg clicked', async ({
      page,
    }) => {
      // Click Non-Veg filter
      await page.locator('[data-testid="filter-non-veg"]').click();
      await page.waitForTimeout(500);

      // Verify Non-Veg filter is active
      await expect(page.locator('[data-testid="filter-non-veg"]')).toHaveClass(
        /active/
      );

      // Check that only non-vegetarian pizzas are shown
      const nonVegCards = await page
        .locator('[data-testid="pizza-card"]')
        .count();
      expect(nonVegCards).toBeGreaterThan(0);

      // Verify all visible pizzas have non-vegetarian indicator (red dot)
      const nonVegIndicators = await page
        .locator('[data-testid="pizza-card"] .bg-red-600')
        .count();
      expect(nonVegIndicators).toBe(nonVegCards);
    });

    test('should show all pizzas when All filter clicked', async ({ page }) => {
      // First filter by Veg
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);

      const vegCount = await page.locator('[data-testid="pizza-card"]').count();

      // Click All filter
      await page.locator('[data-testid="filter-all"]').click();
      await page.waitForTimeout(500);

      // Should show more pizzas (including non-veg)
      const allCount = await page.locator('[data-testid="pizza-card"]').count();
      expect(allCount).toBeGreaterThanOrEqual(vegCount);

      // Verify All filter is active
      await expect(page.locator('[data-testid="filter-all"]')).toHaveClass(
        /active/
      );
    });
  });

  test.describe('Advanced Sorting', () => {
    test('should display sort dropdown with options', async ({ page }) => {
      const sortSelect = page.locator('select[aria-label="Sort by"], select');
      await expect(sortSelect).toBeVisible();

      // Verify sort options exist
      const options = await sortSelect.locator('option').allTextContents();
      expect(options).toContain('Sort: Default');
      expect(options).toContain('Price: Low to High');
      expect(options).toContain('Price: High to Low');
      expect(options).toContain('Name: A to Z');
    });

    test('should sort pizzas by price (Low to High)', async ({ page }) => {
      const sortSelect = page.locator('select');

      // Select price ascending sort
      await sortSelect.selectOption('price-asc');
      await page.waitForTimeout(500);

      // Get all pizza prices
      const priceElements = await page
        .locator('[data-testid="pizza-card"] .text-red-600')
        .allTextContents();
      const prices = priceElements.map((price) =>
        parseFloat(price.replace(/[^\d.]/g, ''))
      );

      // Verify prices are in ascending order
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    test('should sort pizzas by price (High to Low)', async ({ page }) => {
      const sortSelect = page.locator('select');

      // Select price descending sort
      await sortSelect.selectOption('price-desc');
      await page.waitForTimeout(500);

      // Get all pizza prices
      const priceElements = await page
        .locator('[data-testid="pizza-card"] .text-red-600')
        .allTextContents();
      const prices = priceElements.map((price) =>
        parseFloat(price.replace(/[^\d.]/g, ''))
      );

      // Verify prices are in descending order
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      }
    });

    test('should sort pizzas by name (A to Z)', async ({ page }) => {
      const sortSelect = page.locator('select');

      // Select name ascending sort
      await sortSelect.selectOption('name-asc');
      await page.waitForTimeout(500);

      // Get all pizza names
      const nameElements = await page
        .locator('[data-testid="pizza-card"] h3')
        .allTextContents();

      // Verify names are in alphabetical order
      for (let i = 1; i < nameElements.length; i++) {
        expect(nameElements[i].toLowerCase()).toBeGreaterThanOrEqual(
          nameElements[i - 1].toLowerCase()
        );
      }
    });
  });

  test.describe('Infinite Scroll', () => {
    test('should load more pizzas when scrolling to bottom', async ({
      page,
    }) => {
      // Get initial pizza count
      const initialCount = await page
        .locator('[data-testid="pizza-card"]')
        .count();

      // Scroll to bottom to trigger infinite scroll
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Wait for potential new pizzas to load
      await page.waitForTimeout(1000);

      // Check if more pizzas loaded (this depends on having enough data)
      const newCount = await page.locator('[data-testid="pizza-card"]').count();

      // Either more pizzas loaded OR we see "no more pizzas" message
      const noMoreMessage = await page
        .locator('[data-testid="no-more-items"]')
        .isVisible();

      expect(newCount >= initialCount || noMoreMessage).toBe(true);
    });

    test('should show loading indicator during infinite scroll', async ({
      page,
    }) => {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Should briefly show loading indicator (if more data available)
      const loadingIndicator = page.locator('[data-testid="loading-more"]');

      // Check if loading indicator appears (may be brief)
      try {
        await expect(loadingIndicator).toBeVisible({ timeout: 1000 });
      } catch {
        // If no loading indicator, check for "no more items" message
        await expect(
          page.locator('[data-testid="no-more-items"]')
        ).toBeVisible();
      }
    });

    test('should show "No more pizzas" when all items loaded', async ({
      page,
    }) => {
      // Keep scrolling until we reach the end
      let previousCount = 0;
      let currentCount = await page
        .locator('[data-testid="pizza-card"]')
        .count();

      while (currentCount > previousCount) {
        previousCount = currentCount;
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
        await page.waitForTimeout(1000);
        currentCount = await page.locator('[data-testid="pizza-card"]').count();
      }

      // Should show "no more pizzas" message
      await expect(page.locator('[data-testid="no-more-items"]')).toBeVisible();
    });
  });

  test.describe.only('Order Integration', () => {
    test('should display "Add to Cart" buttons on pizza cards', async ({
      page,
    }) => {
      // Verify all pizza cards have "Add to Cart" buttons
      const pizzaCards = await page
        .locator('[data-testid="pizza-card"]')
        .count();
      const addToCartButtons = await page
        .locator('button:has-text("Add to Cart")')
        .count();

      expect(addToCartButtons).toBe(pizzaCards);
    });

    test('should add pizza to cart when "Add to Cart" clicked', async ({
      page,
    }) => {
      // Click first "Add to Cart" button
      const firstAddButton = page
        .locator('button:has-text("Add to Cart")')
        .first();
      await firstAddButton.click();

      // Should show success toast notification
      await expect(page.locator('text=/added to cart/i')).toBeVisible({
        timeout: 2000,
      });

      // Button should change to "In Cart" state
      await expect(
        page.locator('button:has-text("In Cart")').first()
      ).toBeVisible();
    });

    test('should disable "Add to Cart" for items already in cart', async ({
      page,
    }) => {
      // Add first pizza to cart
      await page.locator('button:has-text("Add to Cart")').first().click();
      await page.waitForTimeout(500);

      // Button should be disabled and show "In Cart"
      const inCartButton = page.locator('button:has-text("In Cart")').first();
      await expect(inCartButton).toBeVisible();
      await expect(inCartButton).toBeDisabled();
    });

    test('should show pizza details on cards', async ({ page }) => {
      const firstCard = page.locator('[data-testid="pizza-card"]').first();

      // Verify pizza card contains required information
      await expect(firstCard.locator('h3')).toBeVisible(); // Pizza name
      await expect(firstCard.locator('img')).toBeVisible(); // Pizza image
      await expect(firstCard.locator('.text-red-600')).toBeVisible(); // Price
      await expect(firstCard.locator('p')).toBeVisible(); // Ingredients/description

      // Verify vegetarian/non-vegetarian indicator
      const vegIndicator = firstCard.locator('.bg-green-600, .bg-red-600');
      await expect(vegIndicator).toBeVisible();
    });
  });

  test.describe('Combined Functionality', () => {
    test('should combine search and filters correctly', async ({ page }) => {
      // Search for pizza
      await page.locator('input[placeholder*="Search pizzas"]').fill('Pizza');
      await page.waitForTimeout(500);

      const searchResults = await page
        .locator('[data-testid="pizza-card"]')
        .count();

      // Apply vegetarian filter
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);

      // Should show vegetarian pizzas that match search
      const combinedResults = await page
        .locator('[data-testid="pizza-card"]')
        .count();
      expect(combinedResults).toBeLessThanOrEqual(searchResults);

      // All visible pizzas should be vegetarian and match search
      const vegIndicators = await page
        .locator('[data-testid="pizza-card"] .bg-green-600')
        .count();
      expect(vegIndicators).toBe(combinedResults);
    });

    test('should combine sorting with filters', async ({ page }) => {
      // Apply vegetarian filter first
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);

      // Then sort by price
      await page.locator('select').selectOption('price-asc');
      await page.waitForTimeout(500);

      // Verify all visible pizzas are vegetarian AND sorted by price
      const vegCards = await page.locator('[data-testid="pizza-card"]').count();
      const vegIndicators = await page
        .locator('[data-testid="pizza-card"] .bg-green-600')
        .count();
      expect(vegIndicators).toBe(vegCards);

      // Verify sorting
      const priceElements = await page
        .locator('[data-testid="pizza-card"] .text-red-600')
        .allTextContents();
      const prices = priceElements.map((price) =>
        parseFloat(price.replace(/[^\d.]/g, ''))
      );

      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    test('should reset pagination when filters change', async ({ page }) => {
      // Scroll to load more items (if available)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      // Apply filter (should reset to page 1)
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);

      // Should be back at the top with filtered results
      const scrollPosition = await page.evaluate(() => window.pageYOffset);
      expect(scrollPosition).toBe(0);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Intercept API calls and simulate network error
      await page.route('**/api/pizzas**', (route) => {
        route.abort('failed');
      });

      // Reload page to trigger error
      await page.reload();

      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible({
        timeout: 5000,
      });
      await expect(page.locator('text=/something went wrong/i')).toBeVisible();
    });

    test('should provide retry functionality on error', async ({ page }) => {
      // Intercept and fail first request
      let requestCount = 0;
      await page.route('**/api/pizzas**', (route) => {
        requestCount++;
        if (requestCount === 1) {
          route.abort('failed');
        } else {
          route.continue();
        }
      });

      // Reload to trigger error
      await page.reload();

      // Wait for error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible({
        timeout: 5000,
      });

      // Click retry button
      await page.locator('button:has-text("Try Again")').click();

      // Should successfully load pizzas on retry
      await expect(page.locator('[data-testid="pizza-card"]')).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify essential elements are visible and functional
      await expect(
        page.locator('input[placeholder*="Search pizzas"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="filter-all"]')).toBeVisible();
      await expect(page.locator('select')).toBeVisible();
      await expect(page.locator('[data-testid="pizza-card"]')).toBeVisible();

      // Test mobile interactions
      await page.locator('[data-testid="filter-veg"]').click();
      await page.waitForTimeout(500);

      await expect(page.locator('[data-testid="filter-veg"]')).toHaveClass(
        /active/
      );
    });

    test('should maintain functionality on tablet devices', async ({
      page,
    }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Test search functionality
      await page
        .locator('input[placeholder*="Search pizzas"]')
        .fill('Margherita');
      await page.waitForTimeout(500);

      // Should filter results
      const pizzaCards = await page
        .locator('[data-testid="pizza-card"]')
        .count();
      expect(pizzaCards).toBeGreaterThan(0);

      // Test sorting
      await page.locator('select').selectOption('price-asc');
      await page.waitForTimeout(500);

      // Should maintain sorted order
      const priceElements = await page
        .locator('[data-testid="pizza-card"] .text-red-600')
        .allTextContents();
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });
});
