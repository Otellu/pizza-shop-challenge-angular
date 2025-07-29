import { test, expect } from '@playwright/test';

/**
 * ========================================
 * 🧪 E2E TESTS FOR FEATURE 3 CANDIDATE TASKS
 * ========================================
 * 
 * This test suite validates the implementation tasks that candidates
 * need to complete for Feature 3: Order Complaint Form with Advanced Validation
 * 
 * Note: The boilerplate already includes:
 * - Modal structure and open/close functionality
 * - Basic form HTML with all fields
 * - Helper methods for form options
 * 
 * Candidates must implement:
 * 1. Reactive Forms Setup (7 minutes) - Proper FormGroup with validators and FormArray
 * 2. Advanced Validation (8 minutes) - Custom validators with real-time feedback
 * 3. User Interface Enhancements (6 minutes) - Validation feedback and form states
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
    await page.waitForURL('**/menu', { timeout: 10000 });
    await page.goto('/orders');
    await page.waitForSelector('.container', { timeout: 10000 });
  });

  // ========================================
  // 📝 TASK 1: Reactive Forms Setup (7 minutes)
  // ========================================
  test.describe('Task 1: Reactive Forms Setup', () => {
    test('should properly initialize FormGroup with validators', async ({ page }) => {
      // Wait for orders to load
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        // Click "File Complaint" button
        await page.locator('button:has-text("File Complaint")').first().click();
        
        // Wait for modal to open
        await page.waitForSelector('.fixed.inset-0', { timeout: 2000 });
        
        // Test that form fields have proper validation by checking submit button state
        const submitButton = page.locator('button[type="submit"]');
        
        // Initially, submit should be disabled (form invalid due to required fields)
        await expect(submitButton).toBeDisabled();
      }
    });
  });

  // ========================================
  // ✅ TASK 2: Advanced Validation (8 minutes)
  // ========================================
  test.describe('Task 2: Advanced Validation', () => {
    test('should implement custom validator for description (min 20 chars)', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        const descriptionField = page.locator('textarea#description');
        const submitButton = page.locator('button[type="submit"]');
        
        // Type less than 20 characters
        await descriptionField.fill('Too short');
        await descriptionField.blur();
        
        // Should show validation error (candidates need to implement this)
        const errorMessage = page.locator('[data-testid="description-error"]');
        await expect(errorMessage).toBeVisible();
        
        // Submit button should remain disabled
        await expect(submitButton).toBeDisabled();
        
        // Type exactly 20 characters
        await descriptionField.fill('This is 20 character');
        await descriptionField.blur();
        
        // Error should disappear if other fields are filled
        await page.locator('select#complaintType').selectOption('Quality Issue');
        await page.locator('input[data-testid="email-input"]').fill('user@example.com');
        await page.locator('input[data-testid="phone-input"]').fill('+919876543210');
        
        // If all fields valid, submit should be enabled
        await expect(submitButton).toBeEnabled();
      }
    });

    test('should validate email format when email is provided', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        // Fill required fields first
        await page.locator('select#complaintType').selectOption('Quality Issue');
        await page.locator('textarea#description').fill('The pizza was cold and several toppings were missing from my order');
        
        // Test invalid email formats
        const emailField = page.locator('input[data-testid="email-input"]');
        await emailField.fill('invalid-email');
        await emailField.blur();
        
        // Should show email validation error
        const emailError = page.locator('div[data-testid="email-error"]');
        await expect(emailError).toBeVisible();
        
        // Test another invalid format
        await emailField.fill('test@');
        await emailField.blur();
        await expect(emailError).toBeVisible();
        
        // Test valid email format
        await emailField.fill('user@example.com');
        await emailField.blur();
        await expect(emailError).not.toBeVisible();
      }
    });

    test('should validate India phone number format when phone is provided', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        // Fill required fields first
        await page.locator('select#complaintType').selectOption('Delivery Problem');
        await page.locator('textarea#description').fill('The delivery took over 2 hours and the driver was very rude');
        
        // Test invalid phone formats
        const phoneField = page.locator('input[data-testid="phone-input"]');
        await phoneField.fill('1234567890'); // Missing +91
        await phoneField.blur();
        
        // Should show phone validation error
        const phoneError = page.locator('div[data-testid="phone-error"]');
        await expect(phoneError).toBeVisible();
        
        // Test another invalid format
        await phoneField.fill('+911234'); // Too short
        await phoneField.blur();
        await expect(phoneError).toBeVisible();
        
        // Test valid India phone format (+91 10 digits)
        await phoneField.fill('+919876543210');
        await phoneField.blur();
        await expect(phoneError).not.toBeVisible();
      }
    });

    test('should require at least one contact method (email OR phone)', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        // Fill required fields except contact methods
        await page.locator('select#complaintType').selectOption('Wrong Order');
        await page.locator('textarea#description').fill('I received completely different pizzas than what was ordered');
        
        const submitButton = page.locator('button[type="submit"]');
        
        // Submit should be disabled when no contact method provided
        await expect(submitButton).toBeDisabled();
        
        // Add only email - should be valid
        await page.locator('input[data-testid="email-input"]').fill('user@example.com');
        await expect(submitButton).toBeEnabled();
        
        // Clear email and add only phone - should be valid
        await page.locator('input[data-testid="email-input"]').clear();
        await page.locator('input[data-testid="phone-input"]').fill('+919876543210');
        await expect(submitButton).toBeEnabled();
        
        // Clear phone - should be disabled again
        await page.locator('input[data-testid="phone-input"]').clear();
        await expect(submitButton).toBeDisabled();
        
        // Add both - should be valid
        await page.locator('input[data-testid="email-input"]').fill('user@example.com');
        await page.locator('input[data-testid="phone-input"]').fill('+919876543210');
        await expect(submitButton).toBeEnabled();
      }
    });
  });

  // ========================================
  // 🎨 TASK 3: User Interface Enhancements (6 minutes)
  // ========================================
  test.describe('Task 3: User Interface Enhancements', () => {
    test('should show proper validation feedback for each field', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        // Try to submit empty form
        const submitButton = page.locator('button[type="submit"]');
        
        // If button is enabled, click it to trigger validation
        if (await submitButton.isEnabled()) {
          await submitButton.click();
        } else {
          // Touch all fields to trigger validation display
          await page.locator('select#complaintType').click();
          await page.locator('textarea#description').click();
          await page.locator('body').click(); // Click outside
        }
        
        // Should show validation errors for required fields
        const validationErrors = await page.locator('.text-red-600').count();
        expect(validationErrors).toBeGreaterThan(0);
        
        // Errors should be associated with specific fields
        const typeError = page.locator('div[data-testid="complaint-type-error"]');
        const descError = page.locator('div[data-testid="description-error"]');
        const emailError = page.locator('div[data-testid="email-error"]');
        const phoneError = page.locator('div[data-testid="phone-error"]');
        
        // At least some field-specific errors should be visible
        const hasFieldErrors = 
          await typeError.isVisible() || 
          await descError.isVisible() ||
          await emailError.isVisible() ||
          await phoneError.isVisible();
          
        expect(hasFieldErrors).toBe(true);
      }
    });

    test('should update submit button state based on form validity', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        const submitButton = page.locator('button[type="submit"]');
        
        // Initially disabled
        await expect(submitButton).toBeDisabled();
        
        // Fill required fields progressively
        await page.locator('select#complaintType').selectOption('Quality Issue');
        // Still disabled - more fields required
        await expect(submitButton).toBeDisabled();
        
        await page.locator('textarea#description').fill('The pizza arrived cold and was missing several toppings');
        await page.locator('input[data-testid="email-input"]').fill('user@example.com');
        await page.locator('input[data-testid="phone-input"]').fill('+919876543210');
        await page.locator('textarea#description').fill('The pizza arrived cold and was missing several toppings');
        // Now all required fields filled - should be enabled
        await expect(submitButton).toBeEnabled();
        
        // Clear a field - should disable again
        await page.locator('textarea#description').clear();
        
        await expect(submitButton).toBeDisabled();
      }
    });

    test('should show character count for description field', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        const descriptionField = page.locator('textarea#description');
        
        // Type some text
        await descriptionField.fill('Testing character count feature');
        
        // Should show character count somewhere near the field
        // Could be "31 characters" or "31/20" or similar
        const charCountElement = await page.locator('span[data-testid="description-character-count"]').isVisible();
        
        expect(charCountElement).toBe(true);
      }
    });
  });

  // ========================================
  // 📤 TASK 4: Form Submission (4 minutes)
  // ========================================
  test.describe('Task 4: Form Submission', () => {
    test('should show success feedback after submission', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        // Fill and submit form
        await page.locator('select#complaintType').selectOption('Delivery Problem');
        await page.locator('textarea#description').fill('The delivery took over 2 hours and driver was very rude');
        await page.locator('input[data-testid="email-input"]').fill('user@example.com');
        await page.locator('input[data-testid="phone-input"]').fill('+919876543210');
        await page.locator('button[type="submit"]').click();
        
        // Should show success toast/message
        await expect(page.locator('text=/complaint.*submitted.*successfully|success|thank you/i')).toBeVisible({ timeout: 5000 });
        
        // Modal should close after successful submission
        await expect(page.locator('.fixed.inset-0')).not.toBeVisible({ timeout: 5000 });
      }
    });

    test('should handle API errors gracefully', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        // Fill form with potentially problematic data
        await page.locator('select#complaintType').selectOption('Other');
        await page.locator('textarea#description').fill('A'.repeat(5000)); // Very long description
        await page.locator('input[data-testid="email-input"]').fill('user@example.com');
        await page.locator('input[data-testid="phone-input"]').fill('+919876543210');
        
        await page.locator('button[type="submit"]').click();
        
        // Should handle errors gracefully
        // Either show error toast or keep form open with error message
        const errorHandled = 
          await page.locator('text=/error|failed|try again|problem/i').isVisible({ timeout: 5000 }) ||
          await page.locator('.fixed.inset-0').isVisible(); // Modal stays open on error
          
        expect(errorHandled).toBe(true);
      }
    });

    test('should reset form after successful submission', async ({ page }) => {
      await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 5000 });
      const orderCards = await page.locator('.bg-white.rounded-lg.shadow-md').count();
      
      if (orderCards > 0) {
        // Submit first complaint
        await page.locator('button:has-text("File Complaint")').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        await page.locator('select#complaintType').selectOption('Wrong Order');
        await page.locator('textarea#description').fill('I received completely wrong pizzas in my order');
        await page.locator('input[data-testid="email-input"]').fill('user@example.com');
        await page.locator('input[data-testid="phone-input"]').fill('+919876543210');

        
        // Wait for submission to complete
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(2000);
        
        // Open form again
        await page.locator('button[data-testid="file-complaint-button"]').first().click();
        await page.waitForSelector('.fixed.inset-0');
        
        // Form should be reset
        const typeValue = await page.locator('select#complaintType').inputValue();
        const descValue = await page.locator('textarea#description').inputValue();
        
        expect(typeValue).toBe('');
        expect(descValue).toBe('');
      }
    });
  });
});