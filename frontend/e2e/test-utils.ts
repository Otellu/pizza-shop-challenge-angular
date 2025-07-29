import { Page, expect } from '@playwright/test';

/**
 * Common utilities for E2E tests
 */
export class TestUtils {
  constructor(private page: Page) {}

  /**
   * Wait for pizza cards to load on the page
   */
  async waitForPizzasToLoad(timeout = 10000) {
    await this.page.waitForSelector('[data-testid="pizza-card"]', { timeout });
  }

  /**
   * Get the count of visible pizza cards
   */
  async getPizzaCount(): Promise<number> {
    return await this.page.locator('[data-testid="pizza-card"]').count();
  }

  /**
   * Search for pizzas using the search input
   */
  async searchPizzas(searchTerm: string, waitTime = 500) {
    const searchInput = this.page.locator('input[placeholder*="Search pizzas"]');
    await searchInput.fill(searchTerm);
    await this.page.waitForTimeout(waitTime);
  }

  /**
   * Clear the search input
   */
  async clearSearch(waitTime = 500) {
    const searchInput = this.page.locator('input[placeholder*="Search pizzas"]');
    await searchInput.clear();
    await this.page.waitForTimeout(waitTime);
  }

  /**
   * Click a filter button (all, veg, non-veg)
   */
  async clickFilter(filterType: 'all' | 'veg' | 'non-veg', waitTime = 500) {
    await this.page.locator(`[data-testid="filter-${filterType}"]`).click();
    await this.page.waitForTimeout(waitTime);
  }

  /**
   * Select a sort option from the dropdown
   */
  async selectSort(sortOption: string, waitTime = 500) {
    await this.page.locator('select').selectOption(sortOption);
    await this.page.waitForTimeout(waitTime);
  }

  /**
   * Scroll to the bottom of the page to trigger infinite scroll
   */
  async scrollToBottom(waitTime = 1000) {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(waitTime);
  }

  /**
   * Get all pizza names currently visible
   */
  async getVisiblePizzaNames(): Promise<string[]> {
    return await this.page.locator('[data-testid="pizza-card"] h3').allTextContents();
  }

  /**
   * Get all pizza prices currently visible (as numbers)
   */
  async getVisiblePizzaPrices(): Promise<number[]> {
    const priceElements = await this.page.locator('[data-testid="pizza-card"] .text-red-600').allTextContents();
    return priceElements.map(price => parseFloat(price.replace(/[^\d.]/g, '')));
  }

  /**
   * Check if prices are sorted in ascending order
   */
  async verifyPricesSortedAscending(): Promise<boolean> {
    const prices = await this.getVisiblePizzaPrices();
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] < prices[i - 1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if prices are sorted in descending order
   */
  async verifyPricesSortedDescending(): Promise<boolean> {
    const prices = await this.getVisiblePizzaPrices();
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if names are sorted alphabetically
   */
  async verifyNamesSortedAlphabetically(): Promise<boolean> {
    const names = await this.getVisiblePizzaNames();
    for (let i = 1; i < names.length; i++) {
      if (names[i].toLowerCase() < names[i - 1].toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  /**
   * Add the first pizza to cart
   */
  async addFirstPizzaToCart() {
    const firstAddButton = this.page.locator('button:has-text("Add to Cart")').first();
    await firstAddButton.click();
  }

  /**
   * Verify all visible pizzas are vegetarian (have green indicator)
   */
  async verifyAllPizzasAreVegetarian(): Promise<boolean> {
    const pizzaCount = await this.getPizzaCount();
    const vegIndicatorCount = await this.page.locator('[data-testid="pizza-card"] .bg-green-600').count();
    return pizzaCount === vegIndicatorCount;
  }

  /**
   * Verify all visible pizzas are non-vegetarian (have red indicator)
   */
  async verifyAllPizzasAreNonVegetarian(): Promise<boolean> {
    const pizzaCount = await this.getPizzaCount();
    const nonVegIndicatorCount = await this.page.locator('[data-testid="pizza-card"] .bg-red-600').count();
    return pizzaCount === nonVegIndicatorCount;
  }

  /**
   * Wait for toast notification to appear
   */
  async waitForToast(message: string | RegExp, timeout = 2000) {
    if (typeof message === 'string') {
      await expect(this.page.locator(`text=${message}`)).toBeVisible({ timeout });
    } else {
      await expect(this.page.locator(`text=${message}`)).toBeVisible({ timeout });
    }
  }

  /**
   * Check if filter button is active
   */
  async isFilterActive(filterType: 'all' | 'veg' | 'non-veg'): Promise<boolean> {
    const filterButton = this.page.locator(`[data-testid="filter-${filterType}"]`);
    const classes = await filterButton.getAttribute('class');
    return classes?.includes('active') || false;
  }

  /**
   * Mock API response for testing error scenarios
   */
  async mockApiError(endpoint = '**/api/pizzas**') {
    await this.page.route(endpoint, route => {
      route.abort('failed');
    });
  }

  /**
   * Mock API response with custom data
   */
  async mockApiResponse(endpoint = '**/api/pizzas**', responseData: any) {
    await this.page.route(endpoint, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData)
      });
    });
  }

  /**
   * Verify essential page elements are visible
   */
  async verifyEssentialElements() {
    await expect(this.page.locator('input[placeholder*="Search pizzas"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="filter-all"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="filter-veg"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="filter-non-veg"]')).toBeVisible();
    await expect(this.page.locator('select')).toBeVisible();
  }

  /**
   * Set viewport to mobile size
   */
  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  /**
   * Set viewport to tablet size
   */
  async setTabletViewport() {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  /**
   * Set viewport to desktop size
   */
  async setDesktopViewport() {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }
}

/**
 * Create test utilities instance
 */
export function createTestUtils(page: Page): TestUtils {
  return new TestUtils(page);
}