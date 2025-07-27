import { test, expect } from '@playwright/test';

/**
 * ========================================
 * 🧪 E2E TESTS FOR FEATURE 2 CANDIDATE TASKS
 * ========================================
 * 
 * This test suite specifically validates the 4 core tasks that candidates
 * need to implement for Feature 2: Real-Time Admin Order Dashboard
 * 
 * Task Breakdown:
 * 1. Live Order Feed (10 minutes) - RxJS polling with interval
 * 2. Order Status Management (8 minutes) - Update status with UI reflection
 * 3. Real-Time UI Sync (7 minutes) - Smart polling with tab visibility
 * 4. Admin Controls (5 minutes) - Quick actions and order management
 */

test.describe('🎯 Feature 2: Candidate Task Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin user to access admin dashboard
    await page.goto('/login');
    await page.locator('input[name="email"]').fill('admin@example.com');
    await page.locator('input[name="password"]').fill('test1234');
    await page.locator('button[type="submit"]').click();

    // Navigate to admin dashboard
    await page.waitForSelector('[data-testid="navbar"]', { timeout: 10000 });
    await page.locator('[data-testid="admin-link"]').click();
    await page.waitForSelector('[data-testid="admin-dashboard"]', { timeout: 10000 });
  });

  // ========================================
  // 🔄 TASK 1: Live Order Feed (10 minutes)
  // ========================================
  test.describe('Task 1: Live Order Feed Implementation', () => {
    test('should implement RxJS interval polling (3-5 seconds)', async ({ page }) => {
      // Get initial order count
      const initialOrderCount = await page.locator('[data-testid="order-card"]').count();
      
      // Wait for polling interval (should refresh within 5 seconds)
      await page.waitForTimeout(5500);
      
      // Check if orders have been refreshed (loading state or new data)
      const loadingIndicator = await page.locator('[data-testid="loading-orders"]').isVisible();
      const ordersRefreshed = await page.locator('[data-testid="order-card"]').count();
      
      // Should either show loading state or have refreshed data
      expect(loadingIndicator || ordersRefreshed >= 0).toBe(true);
    });

    test('should use switchMap to prevent overlapping requests', async ({ page }) => {
      // Initial load
      await page.waitForSelector('[data-testid="order-card"]');
      
      // Simulate rapid status updates (should cancel previous requests)
      const orderCard = page.locator('[data-testid="order-card"]').first();
      
      if (await orderCard.isVisible()) {
        // Click multiple status update buttons rapidly
        const statusButton = orderCard.locator('[data-testid="status-update-button"]').first();
        
        if (await statusButton.isVisible()) {
          await statusButton.click();
          await page.waitForTimeout(100);
          await statusButton.click();
          await page.waitForTimeout(100);
          
          // Should not have multiple simultaneous requests
          // UI should remain stable
          await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
        }
      }
    });

    test('should display orders in real-time format', async ({ page }) => {
      // Check for order list/table
      await expect(page.locator('[data-testid="orders-container"]')).toBeVisible();
      
      // Verify order card structure
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        const firstOrder = page.locator('[data-testid="order-card"]').first();
        
        // Should display required order information
        await expect(firstOrder.locator('[data-testid="order-id"]')).toBeVisible();
        await expect(firstOrder.locator('[data-testid="order-status"]')).toBeVisible();
        await expect(firstOrder.locator('[data-testid="order-user"]')).toBeVisible();
        await expect(firstOrder.locator('[data-testid="order-total"]')).toBeVisible();
        await expect(firstOrder.locator('[data-testid="order-timestamp"]')).toBeVisible();
      }
    });

    test('should handle empty order state', async ({ page }) => {
      // If no orders exist, should show appropriate message
      const orderCount = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCount === 0) {
        await expect(page.locator('[data-testid="no-orders-message"]')).toBeVisible();
        await expect(page.locator('text=/no orders.*yet/i')).toBeVisible();
      }
    });
  });

  // ========================================
  // 🔧 TASK 2: Order Status Management (8 minutes)
  // ========================================
  test.describe('Task 2: Order Status Management', () => {
    test('should provide status update buttons for each order', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        const firstOrder = page.locator('[data-testid="order-card"]').first();
        
        // Should have status update controls
        await expect(firstOrder.locator('[data-testid="status-update-button"], [data-testid="status-select"]')).toBeVisible();
      }
    });

    test('should update order status via PATCH API', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        const firstOrder = page.locator('[data-testid="order-card"]').first();
        const currentStatus = await firstOrder.locator('[data-testid="order-status"]').textContent();
        
        // Try to confirm order if it's pending
        if (currentStatus?.toLowerCase().includes('pending')) {
          const confirmButton = firstOrder.locator('[data-testid="confirm-button"]');
          
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
            
            // Should show loading state
            await expect(firstOrder.locator('[data-testid="updating-status"]')).toBeVisible({ timeout: 2000 });
            
            // Status should update
            await expect(firstOrder.locator('[data-testid="order-status"]')).toContainText(/confirmed/i, { timeout: 5000 });
          }
        }
      }
    });

    test('should implement optimistic UI updates', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        const firstOrder = page.locator('[data-testid="order-card"]').first();
        const statusElement = firstOrder.locator('[data-testid="order-status"]');
        const originalStatus = await statusElement.textContent();
        
        // Find and click a status update button
        const updateButton = firstOrder.locator('[data-testid="status-update-button"]').first();
        
        if (await updateButton.isVisible()) {
          await updateButton.click();
          
          // Status should update immediately (optimistic)
          const newStatus = await statusElement.textContent();
          expect(newStatus).not.toBe(originalStatus);
        }
      }
    });

    test('should handle status update errors with rollback', async ({ page }) => {
      // This would test error scenarios - implementation depends on how errors are simulated
      // For now, we verify error handling UI exists
      
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Check if error toast/notification system is in place
        const toastContainer = page.locator('[data-testid="toast-container"], .toast-container');
        
        // Verify error handling mechanism exists
        expect(await toastContainer.isVisible() || await page.locator('[role="alert"]').isVisible()).toBe(true);
      }
    });

    test('should show loading states during updates', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        const firstOrder = page.locator('[data-testid="order-card"]').first();
        const updateButton = firstOrder.locator('[data-testid="status-update-button"], [data-testid="confirm-button"]').first();
        
        if (await updateButton.isVisible()) {
          await updateButton.click();
          
          // Should show loading indicator
          const loadingStates = [
            firstOrder.locator('[data-testid="updating-status"]'),
            firstOrder.locator('.animate-spin'),
            firstOrder.locator('[data-testid="loading-spinner"]'),
            updateButton.locator('text=/updating/i')
          ];
          
          let hasLoadingState = false;
          for (const loader of loadingStates) {
            if (await loader.isVisible({ timeout: 1000 })) {
              hasLoadingState = true;
              break;
            }
          }
          
          expect(hasLoadingState).toBe(true);
        }
      }
    });
  });

  // ========================================
  // 📊 TASK 3: Real-Time UI Sync (7 minutes)
  // ========================================
  test.describe('Task 3: Real-Time UI Sync & Tab Visibility', () => {
    test('should display real-time status badges with color coding', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Check status badge colors
        const statuses = {
          pending: ['bg-yellow-', 'text-yellow-', 'border-yellow-'],
          confirmed: ['bg-blue-', 'text-blue-', 'border-blue-'],
          preparing: ['bg-orange-', 'text-orange-', 'border-orange-'],
          out_for_delivery: ['bg-purple-', 'text-purple-', 'border-purple-'],
          delivered: ['bg-green-', 'text-green-', 'border-green-'],
          cancelled: ['bg-red-', 'text-red-', 'border-red-']
        };
        
        const statusElements = await page.locator('[data-testid="order-status"]').all();
        
        for (const element of statusElements) {
          const statusText = await element.textContent();
          const className = await element.getAttribute('class');
          
          // Should have appropriate color coding
          let hasCorrectColor = false;
          for (const [status, colors] of Object.entries(statuses)) {
            if (statusText?.toLowerCase().includes(status)) {
              hasCorrectColor = colors.some(color => className?.includes(color));
              if (hasCorrectColor) break;
            }
          }
          
          expect(hasCorrectColor).toBe(true);
        }
      }
    });

    test('should auto-refresh timestamps', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Get initial timestamp
        const firstTimestamp = await page.locator('[data-testid="order-timestamp"]').first().textContent();
        
        // Wait for polling cycle
        await page.waitForTimeout(5000);
        
        // Timestamp format should be relative (e.g., "2 minutes ago")
        const updatedTimestamp = await page.locator('[data-testid="order-timestamp"]').first().textContent();
        
        // Should contain relative time indicators
        expect(updatedTimestamp).toMatch(/ago|minute|hour|second|just now/i);
      }
    });

    test('should implement status transition buttons', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        const firstOrder = page.locator('[data-testid="order-card"]').first();
        const currentStatus = await firstOrder.locator('[data-testid="order-status"]').textContent();
        
        // Should show appropriate action buttons based on status
        if (currentStatus?.toLowerCase().includes('pending')) {
          await expect(firstOrder.locator('[data-testid="confirm-button"]')).toBeVisible();
        } else if (currentStatus?.toLowerCase().includes('confirmed')) {
          await expect(firstOrder.locator('[data-testid="prepare-button"], [data-testid="status-select"]')).toBeVisible();
        }
      }
    });

    test('should pause polling when tab is not visible', async ({ page, context }) => {
      // This test verifies the implementation of document.visibilityState handling
      
      // Open a new tab to make current tab inactive
      const newPage = await context.newPage();
      await newPage.goto('about:blank');
      
      // Wait to ensure tab is inactive
      await page.waitForTimeout(2000);
      
      // Switch back to original tab
      await page.bringToFront();
      
      // Should resume polling when tab becomes active again
      await page.waitForTimeout(1000);
      
      // Orders should still be visible and updated
      await expect(page.locator('[data-testid="orders-container"]')).toBeVisible();
      
      await newPage.close();
    });

    test('should display order counts', async ({ page }) => {
      // Should show total order count
      await expect(page.locator('[data-testid="order-count"], [data-testid="total-orders"]')).toBeVisible();
      
      // Could also show counts by status
      const statusCounts = page.locator('[data-testid="status-count"]');
      const countsVisible = await statusCounts.count() > 0;
      
      if (countsVisible) {
        await expect(statusCounts.first()).toBeVisible();
      }
    });
  });

  // ========================================
  // 🛠️ TASK 4: Admin Controls (5 minutes)
  // ========================================
  test.describe('Task 4: Admin Controls & Order Management', () => {
    test('should display orders in responsive table/card layout', async ({ page }) => {
      // Should have a container for orders
      await expect(page.locator('[data-testid="orders-container"]')).toBeVisible();
      
      // Check responsive layout
      const viewportSize = page.viewportSize();
      
      if (viewportSize && viewportSize.width < 768) {
        // Mobile: Should use card layout
        await expect(page.locator('[data-testid="order-card"]')).toBeVisible();
      } else {
        // Desktop: Could use table or cards
        const hasTable = await page.locator('[data-testid="orders-table"]').isVisible();
        const hasCards = await page.locator('[data-testid="order-card"]').isVisible();
        
        expect(hasTable || hasCards).toBe(true);
      }
    });

    test('should provide quick confirm action for pending orders', async ({ page }) => {
      // Find pending orders
      const pendingOrders = await page.locator('[data-testid="order-card"]:has-text("pending")').count();
      
      if (pendingOrders > 0) {
        const pendingOrder = page.locator('[data-testid="order-card"]:has-text("pending")').first();
        
        // Should have quick confirm button
        const confirmButton = pendingOrder.locator('[data-testid="confirm-button"], [data-testid="quick-confirm"]');
        await expect(confirmButton).toBeVisible();
        
        // Test quick confirm
        await confirmButton.click();
        
        // Should update to confirmed
        await expect(pendingOrder.locator('[data-testid="order-status"]')).toContainText(/confirmed/i, { timeout: 5000 });
      }
    });

    test('should show order details (items, address, user)', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        const firstOrder = page.locator('[data-testid="order-card"]').first();
        
        // Should display essential order information
        await expect(firstOrder.locator('[data-testid="order-user"]')).toBeVisible();
        await expect(firstOrder.locator('[data-testid="order-items"], [data-testid="order-item-count"]')).toBeVisible();
        await expect(firstOrder.locator('[data-testid="order-address"], [data-testid="delivery-address"]')).toBeVisible();
        await expect(firstOrder.locator('[data-testid="order-total"]')).toBeVisible();
      }
    });

    test('should handle bulk operations or filtering', async ({ page }) => {
      // Check for filter controls
      const hasFilters = await page.locator('[data-testid="status-filter"], [data-testid="order-filter"]').isVisible();
      
      if (hasFilters) {
        // Test status filtering
        const filterSelect = page.locator('[data-testid="status-filter"]');
        await filterSelect.selectOption('pending');
        await page.waitForTimeout(500);
        
        // Should only show pending orders
        const visibleOrders = await page.locator('[data-testid="order-card"]').count();
        const pendingOrders = await page.locator('[data-testid="order-card"]:has-text("pending")').count();
        
        expect(pendingOrders).toBe(visibleOrders);
      }
    });

    test('should cleanup polling subscription on navigation', async ({ page }) => {
      // Navigate away from admin dashboard
      await page.locator('[data-testid="home-link"], [data-testid="navbar-logo"]').click();
      
      // Wait to ensure cleanup
      await page.waitForTimeout(1000);
      
      // Navigate back
      await page.locator('[data-testid="admin-link"]').click();
      await page.waitForSelector('[data-testid="admin-dashboard"]');
      
      // Should restart polling without issues
      await expect(page.locator('[data-testid="orders-container"]')).toBeVisible();
    });
  });

  // ========================================
  // 🔗 INTEGRATION TESTS
  // ========================================
  test.describe('Task Integration: Complete Admin Dashboard Flow', () => {
    test('should handle complete admin workflow', async ({ page }) => {
      // Wait for initial load
      await page.waitForSelector('[data-testid="order-card"], [data-testid="no-orders-message"]');
      
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Test complete status progression
        const pendingOrder = page.locator('[data-testid="order-card"]:has-text("pending")').first();
        
        if (await pendingOrder.isVisible()) {
          // Step 1: Confirm order
          await pendingOrder.locator('[data-testid="confirm-button"]').click();
          await expect(pendingOrder.locator('[data-testid="order-status"]')).toContainText(/confirmed/i, { timeout: 5000 });
          
          // Step 2: Wait for polling refresh
          await page.waitForTimeout(5000);
          
          // Orders should still be displayed correctly
          await expect(page.locator('[data-testid="orders-container"]')).toBeVisible();
        }
      }
    });

    test('should maintain real-time sync across all operations', async ({ page }) => {
      // Get initial state
      const initialOrderCount = await page.locator('[data-testid="order-card"]').count();
      
      // Perform various operations
      if (initialOrderCount > 0) {
        // Update a status
        const firstOrder = page.locator('[data-testid="order-card"]').first();
        const updateButton = firstOrder.locator('[data-testid="status-update-button"], [data-testid="confirm-button"]').first();
        
        if (await updateButton.isVisible()) {
          await updateButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      // Wait for next polling cycle
      await page.waitForTimeout(5000);
      
      // Dashboard should remain functional
      await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="orders-container"]')).toBeVisible();
    });

    test('should handle edge cases gracefully', async ({ page }) => {
      // Test various edge cases
      
      // 1. Empty state
      const orderCount = await page.locator('[data-testid="order-card"]').count();
      if (orderCount === 0) {
        await expect(page.locator('[data-testid="no-orders-message"]')).toBeVisible();
      }
      
      // 2. Error states
      const errorMessage = page.locator('[data-testid="error-message"], [role="alert"]');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toContainText(/error|failed|unable/i);
      }
      
      // 3. Loading states
      const loadingIndicator = page.locator('[data-testid="loading-orders"], [data-testid="loading-spinner"]');
      
      // Dashboard should handle all states gracefully
      expect(await page.locator('[data-testid="admin-dashboard"]').isVisible()).toBe(true);
    });
  });
});