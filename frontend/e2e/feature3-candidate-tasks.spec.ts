import { test, expect } from '@playwright/test';

/**
 * ========================================
 * 🧪 E2E TESTS FOR FEATURE 3 CANDIDATE TASKS
 * ========================================
 * 
 * This test suite specifically validates the 4 core tasks that candidates
 * need to implement for Feature 3: Order Complaint Form with Advanced Validation
 * 
 * Task Breakdown:
 * 1. Reactive Forms Setup (7 minutes) - FormGroup with TypeScript typing
 * 2. Advanced Validation (8 minutes) - Custom validators with real-time feedback
 * 3. User Interface (6 minutes) - Modal/expandable form per order
 * 4. Form Submission (4 minutes) - API integration with error handling
 */

test.describe('🎯 Feature 3: Candidate Task Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as regular user to access order history
    await page.goto('/login');
    await page.locator('input[name="email"]').fill('user@example.com');
    await page.locator('input[name="password"]').fill('test1234');
    await page.locator('button[type="submit"]').click();

    // Navigate to order history page
    await page.waitForSelector('[data-testid="navbar"]', { timeout: 10000 });
    await page.locator('[data-testid="orders-link"]').click();
    await page.waitForSelector('[data-testid="order-history"]', { timeout: 10000 });
  });

  // ========================================
  // 📝 TASK 1: Reactive Forms Setup (7 minutes)
  // ========================================
  test.describe('Task 1: Reactive Forms Setup', () => {
    test('should provide "File Complaint" button for each order', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Each order should have a complaint button
        const complaintButtons = await page.locator('[data-testid="complaint-button"]').count();
        expect(complaintButtons).toBe(orderCards);
        
        // Verify first button is visible
        await expect(page.locator('[data-testid="complaint-button"]').first()).toBeVisible();
      } else {
        // Should show no orders message
        await expect(page.locator('[data-testid="no-orders-message"]')).toBeVisible();
      }
    });

    test('should open complaint form modal/dropdown when clicked', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Click complaint button
        await page.locator('[data-testid="complaint-button"]').first().click();
        
        // Should open complaint form
        await expect(page.locator('[data-testid="complaint-form"]')).toBeVisible({ timeout: 2000 });
        
        // Form should be contained in modal or expandable section
        const isModal = await page.locator('[data-testid="complaint-modal"]').isVisible();
        const isExpandable = await page.locator('[data-testid="complaint-form-expanded"]').isVisible();
        
        expect(isModal || isExpandable).toBe(true);
      }
    });

    test('should create FormGroup with all required fields', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Verify all form fields exist
        await expect(page.locator('[data-testid="complaint-type-select"]')).toBeVisible();
        await expect(page.locator('[data-testid="description-textarea"]')).toBeVisible();
        await expect(page.locator('[data-testid="priority-radio-group"]')).toBeVisible();
        await expect(page.locator('[data-testid="contact-preference-checkboxes"]')).toBeVisible();
      }
    });

    test('should use FormArray for contact preferences', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Should have multiple checkbox options
        const emailCheckbox = page.locator('[data-testid="contact-email-checkbox"]');
        const phoneCheckbox = page.locator('[data-testid="contact-phone-checkbox"]');
        
        await expect(emailCheckbox).toBeVisible();
        await expect(phoneCheckbox).toBeVisible();
        
        // Should be able to select multiple options
        await emailCheckbox.check();
        await phoneCheckbox.check();
        
        await expect(emailCheckbox).toBeChecked();
        await expect(phoneCheckbox).toBeChecked();
      }
    });
  });

  // ========================================
  // ✅ TASK 2: Advanced Validation (8 minutes)
  // ========================================
  test.describe('Task 2: Advanced Validation', () => {
    test('should implement custom validator for description (min 20 chars)', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        const descriptionField = page.locator('[data-testid="description-textarea"]');
        const submitButton = page.locator('[data-testid="submit-complaint-button"]');
        
        // Type less than 20 characters
        await descriptionField.fill('Too short');
        await descriptionField.blur();
        
        // Should show validation error
        await expect(page.locator('[data-testid="description-error"]')).toBeVisible();
        await expect(page.locator('text=/at least 20 characters/i')).toBeVisible();
        
        // Submit button should be disabled
        await expect(submitButton).toBeDisabled();
        
        // Type exactly 20 characters
        await descriptionField.fill('This is 20 character');
        await descriptionField.blur();
        
        // Error should disappear
        await expect(page.locator('[data-testid="description-error"]')).not.toBeVisible();
      }
    });

    test('should show real-time validation as user types', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        const descriptionField = page.locator('[data-testid="description-textarea"]');
        
        // Start typing
        await descriptionField.fill('Short');
        
        // Should show character count or error immediately
        const charCount = page.locator('[data-testid="char-count"]');
        const errorMessage = page.locator('[data-testid="description-error"]');
        
        const hasRealtimeFeedback = await charCount.isVisible() || await errorMessage.isVisible();
        expect(hasRealtimeFeedback).toBe(true);
        
        // Continue typing to meet requirement
        await descriptionField.fill('This is a valid complaint description');
        
        // Error should clear in real-time
        if (await errorMessage.isVisible()) {
          await expect(errorMessage).not.toBeVisible();
        }
      }
    });

    test('should handle form state management (dirty, touched, valid)', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        const submitButton = page.locator('[data-testid="submit-complaint-button"]');
        
        // Initially, submit should be disabled (form invalid)
        await expect(submitButton).toBeDisabled();
        
        // Fill required fields
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Quality Issue');
        await page.locator('[data-testid="description-textarea"]').fill('The pizza was cold when delivered and toppings were missing');
        await page.locator('[data-testid="priority-high-radio"]').check();
        
        // Submit should now be enabled
        await expect(submitButton).toBeEnabled();
      }
    });

    test('should implement conditional validation based on complaint type', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Select "Other" complaint type
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Other');
        
        // Should require more detailed description or show additional fields
        const additionalField = page.locator('[data-testid="other-details-field"]');
        const extendedValidation = await additionalField.isVisible();
        
        if (extendedValidation) {
          await expect(additionalField).toBeVisible();
        } else {
          // Alternative: longer description requirement
          const descriptionField = page.locator('[data-testid="description-textarea"]');
          await descriptionField.fill('Short description');
          await descriptionField.blur();
          
          // Might show stricter validation for "Other" type
          const errorVisible = await page.locator('[data-testid="description-error"]').isVisible();
          expect(errorVisible).toBe(true);
        }
      }
    });
  });

  // ========================================
  // 🎨 TASK 3: User Interface (6 minutes)
  // ========================================
  test.describe('Task 3: User Interface', () => {
    test('should display all required form fields with proper types', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Complaint Type - Dropdown
        const typeSelect = page.locator('[data-testid="complaint-type-select"]');
        await expect(typeSelect).toBeVisible();
        const options = await typeSelect.locator('option').allTextContents();
        expect(options).toContain('Quality Issue');
        expect(options).toContain('Delivery Problem');
        expect(options).toContain('Wrong Order');
        expect(options).toContain('Other');
        
        // Description - Textarea
        const descriptionTextarea = page.locator('[data-testid="description-textarea"]');
        await expect(descriptionTextarea).toBeVisible();
        await expect(descriptionTextarea).toHaveAttribute('type', 'textarea');
        
        // Priority - Radio buttons
        await expect(page.locator('[data-testid="priority-low-radio"]')).toBeVisible();
        await expect(page.locator('[data-testid="priority-medium-radio"]')).toBeVisible();
        await expect(page.locator('[data-testid="priority-high-radio"]')).toBeVisible();
        
        // Contact Preference - Checkboxes
        await expect(page.locator('[data-testid="contact-email-checkbox"]')).toBeVisible();
        await expect(page.locator('[data-testid="contact-phone-checkbox"]')).toBeVisible();
      }
    });

    test('should disable submit button until form is valid', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        const submitButton = page.locator('[data-testid="submit-complaint-button"]');
        
        // Initially disabled
        await expect(submitButton).toBeDisabled();
        
        // Fill required fields one by one
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Quality Issue');
        await expect(submitButton).toBeDisabled(); // Still disabled
        
        await page.locator('[data-testid="description-textarea"]').fill('The pizza arrived cold and was missing toppings');
        await expect(submitButton).toBeDisabled(); // Still disabled
        
        await page.locator('[data-testid="priority-high-radio"]').check();
        await expect(submitButton).toBeEnabled(); // Now enabled
      }
    });

    test('should allow closing modal/form without submission', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Look for close button or cancel button
        const closeButton = page.locator('[data-testid="close-complaint-form"], [data-testid="cancel-button"]');
        
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await expect(page.locator('[data-testid="complaint-form"]')).not.toBeVisible();
        } else {
          // Click outside modal to close
          await page.locator('body').click({ position: { x: 0, y: 0 } });
          await expect(page.locator('[data-testid="complaint-form"]')).not.toBeVisible();
        }
      }
    });

    test('should show form feedback for each field', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Each field should have associated labels
        await expect(page.locator('label[for="complaint-type"]')).toBeVisible();
        await expect(page.locator('label[for="description"]')).toBeVisible();
        await expect(page.locator('text=/priority/i')).toBeVisible();
        await expect(page.locator('text=/contact preference/i')).toBeVisible();
        
        // Required field indicators
        const requiredIndicators = await page.locator('.required, text=*, [aria-required="true"]').count();
        expect(requiredIndicators).toBeGreaterThan(0);
      }
    });
  });

  // ========================================
  // 📤 TASK 4: Form Submission (4 minutes)
  // ========================================
  test.describe('Task 4: Form Submission', () => {
    test('should handle form submission with POST to /api/orders/:orderId/complaint', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Fill out form completely
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Quality Issue');
        await page.locator('[data-testid="description-textarea"]').fill('The pizza was cold and several toppings were missing from my order');
        await page.locator('[data-testid="priority-high-radio"]').check();
        await page.locator('[data-testid="contact-email-checkbox"]').check();
        
        // Submit form
        await page.locator('[data-testid="submit-complaint-button"]').click();
        
        // Should show loading state
        await expect(page.locator('[data-testid="submitting-complaint"], .loading-spinner')).toBeVisible({ timeout: 2000 });
      }
    });

    test('should show success feedback with toast notification', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Fill and submit form
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Delivery Problem');
        await page.locator('[data-testid="description-textarea"]').fill('The delivery took over 2 hours and driver was very rude');
        await page.locator('[data-testid="priority-high-radio"]').check();
        await page.locator('[data-testid="submit-complaint-button"]').click();
        
        // Should show success toast
        await expect(page.locator('text=/complaint.*submitted.*successfully/i')).toBeVisible({ timeout: 5000 });
        
        // Form should close or reset
        const formClosed = await page.locator('[data-testid="complaint-form"]').isHidden();
        const formReset = await page.locator('[data-testid="description-textarea"]').inputValue() === '';
        
        expect(formClosed || formReset).toBe(true);
      }
    });

    test('should handle API errors gracefully', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Note: This tests error handling UI - actual error scenarios depend on implementation
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Check if error handling UI exists
        const toastContainer = page.locator('[data-testid="toast-container"], .toast-container');
        const alertElement = page.locator('[role="alert"]');
        
        // Verify error handling mechanism is in place
        expect(await toastContainer.isVisible() || await alertElement.isVisible()).toBe(true);
      }
    });

    test('should reset form after successful submission', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Submit first complaint
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Wrong Order');
        await page.locator('[data-testid="description-textarea"]').fill('I received completely wrong pizzas in my order');
        await page.locator('[data-testid="priority-high-radio"]').check();
        await page.locator('[data-testid="submit-complaint-button"]').click();
        
        // Wait for submission to complete
        await page.waitForTimeout(2000);
        
        // Open form again (if possible)
        const complaintButton = page.locator('[data-testid="complaint-button"]').first();
        if (await complaintButton.isVisible() && await complaintButton.isEnabled()) {
          await complaintButton.click();
          await page.waitForSelector('[data-testid="complaint-form"]');
          
          // Form should be reset
          const typeValue = await page.locator('[data-testid="complaint-type-select"]').inputValue();
          const descValue = await page.locator('[data-testid="description-textarea"]').inputValue();
          
          expect(typeValue).toBe('');
          expect(descValue).toBe('');
        }
      }
    });

    test('should show loading states during API calls', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Fill form
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Quality Issue');
        await page.locator('[data-testid="description-textarea"]').fill('Pizza quality was very poor and ingredients seemed stale');
        await page.locator('[data-testid="priority-medium-radio"]').check();
        
        // Click submit and immediately check for loading state
        const submitButton = page.locator('[data-testid="submit-complaint-button"]');
        await submitButton.click();
        
        // Should show loading indicator
        const loadingStates = [
          page.locator('[data-testid="submitting-complaint"]'),
          page.locator('.loading-spinner'),
          submitButton.locator('text=/submitting/i'),
          page.locator('[data-testid="loading-indicator"]')
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
    });
  });

  // ========================================
  // 🔗 INTEGRATION TESTS
  // ========================================
  test.describe('Task Integration: Complete Complaint Form Flow', () => {
    test('should handle complete complaint submission workflow', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        // Step 1: Open complaint form
        await page.locator('[data-testid="complaint-button"]').first().click();
        await expect(page.locator('[data-testid="complaint-form"]')).toBeVisible();
        
        // Step 2: Test validation
        await page.locator('[data-testid="description-textarea"]').fill('Short');
        await page.locator('[data-testid="submit-complaint-button"]').click();
        await expect(page.locator('[data-testid="description-error"]')).toBeVisible();
        
        // Step 3: Fill valid data
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Delivery Problem');
        await page.locator('[data-testid="description-textarea"]').fill('The delivery was extremely late and the pizza arrived cold');
        await page.locator('[data-testid="priority-high-radio"]').check();
        await page.locator('[data-testid="contact-email-checkbox"]').check();
        await page.locator('[data-testid="contact-phone-checkbox"]').check();
        
        // Step 4: Submit
        await page.locator('[data-testid="submit-complaint-button"]').click();
        
        // Step 5: Verify success
        await expect(page.locator('text=/complaint.*submitted/i')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should handle multiple complaints for different orders', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards >= 2) {
        // Submit complaint for first order
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Quality Issue');
        await page.locator('[data-testid="description-textarea"]').fill('First order had quality issues with cold pizza');
        await page.locator('[data-testid="priority-medium-radio"]').check();
        await page.locator('[data-testid="submit-complaint-button"]').click();
        
        await page.waitForTimeout(2000);
        
        // Submit complaint for second order
        await page.locator('[data-testid="complaint-button"]').nth(1).click();
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Wrong Order');
        await page.locator('[data-testid="description-textarea"]').fill('Second order was completely wrong items delivered');
        await page.locator('[data-testid="priority-high-radio"]').check();
        await page.locator('[data-testid="submit-complaint-button"]').click();
        
        // Both should succeed independently
        await expect(page.locator('text=/complaint.*submitted/i')).toBeVisible();
      }
    });

    test('should maintain form state during validation errors', async ({ page }) => {
      const orderCards = await page.locator('[data-testid="order-card"]').count();
      
      if (orderCards > 0) {
        await page.locator('[data-testid="complaint-button"]').first().click();
        await page.waitForSelector('[data-testid="complaint-form"]');
        
        // Fill some fields
        await page.locator('[data-testid="complaint-type-select"]').selectOption('Other');
        await page.locator('[data-testid="priority-low-radio"]').check();
        await page.locator('[data-testid="contact-email-checkbox"]').check();
        
        // Submit with invalid description
        await page.locator('[data-testid="description-textarea"]').fill('Too short');
        await page.locator('[data-testid="submit-complaint-button"]').click();
        
        // Should show error but maintain other field values
        await expect(page.locator('[data-testid="description-error"]')).toBeVisible();
        
        // Check other fields retained values
        const typeValue = await page.locator('[data-testid="complaint-type-select"]').inputValue();
        expect(typeValue).toBe('Other');
        
        await expect(page.locator('[data-testid="priority-low-radio"]')).toBeChecked();
        await expect(page.locator('[data-testid="contact-email-checkbox"]')).toBeChecked();
      }
    });

    test('should handle edge cases gracefully', async ({ page }) => {
      // Test various edge cases
      
      // 1. No orders state
      const orderCount = await page.locator('[data-testid="order-card"]').count();
      if (orderCount === 0) {
        await expect(page.locator('[data-testid="no-orders-message"]')).toBeVisible();
        await expect(page.locator('text=/no orders.*complaint/i')).toBeVisible();
      }
      
      // 2. Already complained orders (if implemented)
      const disabledButtons = await page.locator('[data-testid="complaint-button"]:disabled').count();
      if (disabledButtons > 0) {
        const disabledButton = page.locator('[data-testid="complaint-button"]:disabled').first();
        await expect(disabledButton).toHaveAttribute('title', /already.*complained/i);
      }
      
      // 3. Form remains functional across all scenarios
      if (orderCount > 0) {
        const enabledButton = page.locator('[data-testid="complaint-button"]:enabled').first();
        if (await enabledButton.isVisible()) {
          await enabledButton.click();
          await expect(page.locator('[data-testid="complaint-form"]')).toBeVisible();
        }
      }
    });
  });
});