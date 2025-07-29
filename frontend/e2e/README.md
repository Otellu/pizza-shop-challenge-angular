# E2E Tests for Pizza Discovery Feature

This directory contains Playwright end-to-end tests for Feature 1: Smart Pizza Discovery + State Management.

## Test Files

- **`pizza-discovery.spec.ts`** - Comprehensive E2E tests covering all aspects of Feature 1
- **`pizza-discovery-simplified.spec.ts`** - Simplified tests focusing on core functionality
- **`test-utils.ts`** - Utility functions and helpers for common test operations

## What's Tested

### 🔍 Search Functionality
- Real-time search with debouncing (300ms)
- Search result filtering
- Empty search state handling
- Search input clearing

### 🥗 Dietary Filters
- "All", "Veg", and "Non-Veg" filter buttons
- Filter state management
- Visual indicators for dietary preferences
- Filter combination with other features

### 📊 Advanced Sorting
- Price sorting (Low to High, High to Low)
- Name sorting (A to Z)
- Default sorting
- Sort dropdown functionality

### 📜 Infinite Scroll
- Automatic loading of more pizzas when scrolling
- Loading indicators during fetch
- "No more pizzas" end state
- Performance with large datasets

### 🛒 Order Integration
- Add to cart functionality
- Cart state persistence
- Success notifications
- Button state changes

### 🔗 Combined Features
- Search + Filter combinations
- Filter + Sort combinations
- Pagination reset on filter changes

### 📱 Responsive Design
- Mobile viewport testing
- Tablet viewport testing
- Touch interactions
- Layout adaptations

### 🚨 Error Handling
- Network error scenarios
- API failure recovery
- Retry mechanisms
- User feedback

## Running the Tests

### Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app should be running on `http://localhost:4200`

### Test Commands

```bash
# Run all E2E tests
npm run e2e

# Run tests with UI mode (interactive)
npm run e2e:ui

# Run tests in headed mode (see browser)
npm run e2e:headed

# Run tests in debug mode
npm run e2e:debug

# Run specific test file
npx playwright test pizza-discovery.spec.ts

# Run simplified tests only
npx playwright test pizza-discovery-simplified.spec.ts
```

### Browser Configuration

Tests run on multiple browsers by default:
- Chromium (Desktop)
- Firefox (Desktop)
- Webkit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Test Structure

### Comprehensive Tests (`pizza-discovery.spec.ts`)

1. **Search Functionality**
   - Search input visibility and functionality
   - Debouncing behavior verification
   - Search result accuracy
   - Empty state handling

2. **Dietary Filters**
   - Filter button presence and states
   - Vegetarian/Non-vegetarian filtering
   - Filter combination testing

3. **Advanced Sorting**
   - Sort dropdown options
   - Price sorting validation
   - Name sorting validation
   - Sort order verification

4. **Infinite Scroll**
   - Scroll-triggered loading
   - Loading state indicators
   - End-of-list handling

5. **Order Integration**
   - Add to cart functionality
   - Cart state management
   - Success notifications

6. **Combined Functionality**
   - Multi-feature interactions
   - State management across features

7. **Error Handling**
   - Network error simulation
   - Recovery mechanisms

8. **Responsive Design**
   - Mobile compatibility
   - Tablet compatibility

### Simplified Tests (`pizza-discovery-simplified.spec.ts`)

Focused tests covering core functionality:
- Basic search and filter
- Sort functionality
- Cart integration
- Mobile responsiveness
- Error handling

### Test Utilities (`test-utils.ts`)

Helper methods for common operations:
- `waitForPizzasToLoad()` - Wait for initial load
- `searchPizzas(term)` - Perform search
- `clickFilter(type)` - Click filter buttons
- `selectSort(option)` - Select sort option
- `scrollToBottom()` - Trigger infinite scroll
- `addFirstPizzaToCart()` - Add pizza to cart
- `mockApiError()` - Simulate API errors
- And many more...

## Expected Test Data

Tests expect the application to have:
- Multiple pizza items with names, prices, and dietary info
- Working API endpoints for filtering, sorting, and pagination
- Proper data-testid attributes on key elements
- Toast notification system
- Error handling UI

## Data Test IDs Required

Ensure these data-testid attributes are present:

```html
<!-- Pizza cards -->
<div data-testid="pizza-card">

<!-- Filter buttons -->
<button data-testid="filter-all">
<button data-testid="filter-veg">
<button data-testid="filter-non-veg">

<!-- States -->
<div data-testid="loading-more">
<div data-testid="no-more-items">
<div data-testid="no-results">
<div data-testid="error-message">
```

## Test Debugging

### Visual Debugging
```bash
# Run with browser visible
npm run e2e:headed

# Run with Playwright UI
npm run e2e:ui
```

### Test Reports
After running tests, view the HTML report:
```bash
npx playwright show-report
```

### Recording Tests
```bash
# Record new tests
npx playwright codegen localhost:4200
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Ensure dev server is running on port 4200
   - Check network connectivity
   - Increase timeout values if needed

2. **Element not found errors**
   - Verify data-testid attributes are present
   - Check if elements are properly rendered
   - Ensure proper loading states

3. **Flaky tests**
   - Add proper wait conditions
   - Use `waitForTimeout()` or `waitForSelector()`
   - Check for race conditions

### Performance Tips

- Use `test.describe.configure({ mode: 'parallel' })` for faster execution
- Run specific test files during development
- Use headless mode for faster execution in CI

## Contributing

When adding new tests:
1. Use the test utilities for common operations
2. Add proper wait conditions
3. Test multiple viewport sizes
4. Include error scenarios
5. Follow existing naming conventions
6. Document any new test utilities