# Pizza Shop Challenge - Angular Frontend

Welcome to the Pizza Shop Challenge! This is an Angular frontend challenge where you'll be implementing advanced features to demonstrate senior-level Angular development skills.

### 🎯 **Your tasks** (What you need to implement)

#### **Feature 1: Smart Pizza Discovery + State Management**

#### **Feature 2: Real-Time Admin Order Dashboard**

#### **Feature 3: Order Complaint Form with Advanced Validation**

---

# 🚀 Getting started

<details>

<summary><i>Open instructions</i></summary>

### 1. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (Angular)
cd frontend
npm start
```

#### **Login Credentials**

**User Account:**

- Email: `user@example.com`
- Password: `test1234`
- Role: Regular user (can place orders, view order history)

**Admin Account:**

- Email: `admin@example.com`
- Password: `test1234`
- Role: Administrator (can manage pizzas, view all orders, access admin dashboard)
</details>

---

# 🎯 **FEATURE 1: Smart Pizza Discovery + State Management**

<details>

<summary><i>Open instructions</i></summary>

**Time Estimate**: 35 minutes

## 🎬 What You're Building

You'll implement an advanced pizza discovery system that demonstrates senior Angular skills:

- **Real-time Search**: Debounced search with client-side filtering
- **Smart Filtering**: Filter by diet type (All/Veg/Non-Veg) with state management
- **Advanced Sorting**: Sort by price (Low→High, High→Low), name (A→Z)
- **Infinite Scroll**: Load more pizzas on scroll using pagination
- **Order Creation**: Create orders via POST API integration
- **State Management**: Maintain all filter/search/sort state

## 📊 Sample Data Context

The database contains ~50 pizzas with these properties:

```javascript
{
  "_id": "...",
  "name": "Margherita",
  "price": 12.99,
  "isVegetarian": true,
  "description": "...",
  "imageUrl": "..."
}
```

## 🔧 Available Backend API

**Endpoint**: `GET /api/pizzas` - Ready to use, no backend changes needed!

### Query Parameters Available:

- `filter`: `'veg'` | `'non-veg'` | undefined (shows all pizzas)
- `sortBy`: `'price'` | `'name'` | `'createdAt'` (default: 'createdAt')
- `sortOrder`: `'asc'` | `'desc'` (default: 'desc' for newest first)
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `search`: string (searches pizza names)

### Required Response Format:

```json
{
  "pizzas": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 45,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "limit": 10
  }
}
```

### Order Creation API:

```bash
# Create order endpoint
POST /api/orders
Authorization: Bearer <token>

# Body example:
{
  "items": [
    { "id": "pizza1", "name": "Margherita", "price": 12.99, "quantity": 2 }
  ],
  "deliveryAddress": "123 Main St, City, State 12345",
  "totalAmount": 25.98
}
```

## 🎨 Angular Frontend Implementation

**File**: `frontend-angular/src/app/shared/pizza-list/pizza-list.component.ts`

### Required Angular Features:

**Search Implementation:**
- [ ] Real-time search input with RxJS debouncing (300ms)
- [ ] Client-side filtering for instant results
- [ ] Clear search functionality

**Filter System:**
- [ ] Three filter buttons: "All", "Veg", "Non-Veg"  
- [ ] Active state styling using Angular directives
- [ ] State management with NgRx Signals

**Sorting Options:**
- [ ] Dropdown with: "Default", "Price: Low→High", "Price: High→Low", "Name: A→Z"
- [ ] Reactive sorting with immediate UI updates
- [ ] Maintain sort state across filter changes

**Infinite Scroll:**
- [ ] Intersection Observer API implementation
- [ ] Load more on scroll using pagination API
- [ ] Loading states and error handling
- [ ] "No more results" state management

**Order Creation:**
- [ ] Implement order POST functionality
- [ ] Cart integration with order creation
- [ ] Success/error feedback with toast notifications

## ✅ Success Criteria

**You'll know it's working when:**

1. Filter buttons change the displayed pizzas correctly
2. Sort dropdown reorders pizzas by price
3. Scrolling to bottom loads more pizzas automatically
4. Loading states show during API calls
5. "No more pizzas" message appears at the end

## 🧪 Quick Verification

1. Start with "All" filter, "Default" sort (newest pizzas first)
2. Click "Veg" - only vegetarian pizzas display (still newest first)
3. Change sort to "Price: Low to High" - cheapest veg pizzas first
4. Click "Non-Veg" - only non-vegetarian pizzas, cheapest first
5. Change to "Price: High to Low" - most expensive non-veg pizzas first
6. Scroll down - more pizzas load automatically

## ⚠️ Common Gotchas

- Remember to reset to page 1 when filters/sort change
- Handle empty results (no veg pizzas found)
- Prevent duplicate API calls during scroll
- Clear previous results when changing filters
- When no `veg` parameter is sent, show all pizzas (don't filter)
- Default sort should be newest pizzas first (createdAt desc)

## 🔗 API Examples

```bash
# Get all pizzas, newest first (default)
GET /api/pizzas?page=1&limit=10

# Get all pizzas sorted by price (cheapest first)
GET /api/pizzas?sortBy=price&sortOrder=asc&page=1&limit=10

# Get only vegetarian pizzas, most expensive first
GET /api/pizzas?veg=true&sortBy=price&sortOrder=desc&page=1&limit=10

# Get only non-vegetarian pizzas, newest first
GET /api/pizzas?veg=false&page=2&limit=10
```

</details>

---

# 🎯 **FEATURE 2: Real-Time Admin Order Dashboard**

<details>

<summary><i>Open instructions</i></summary>

**Time Estimate**: 30 minutes

## 🎬 What You're Building

You'll implement a real-time admin dashboard that demonstrates advanced Angular real-time patterns:

- **Live Order Feed**: Auto-refresh order list every 3-5 seconds using RxJS polling
- **Order Status Management**: Update order statuses with immediate UI reflection
- **Real-Time UI Sync**: Smart polling with tab visibility optimization
- **Admin Controls**: Quick status updates and order management

## 📊 Available Order Data Structure

Orders from the API will have this structure:

```javascript
{
  "_id": "60d5f484f4b7a5b8c8f8e123",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "items": [
    {
      "id": "60d5f484f4b7a5b8c8f8e125",
      "name": "Margherita", 
      "price": 12.99,
      "quantity": 2
    }
  ],
  "status": "pending", // pending → confirmed → preparing → out_for_delivery → delivered
  "deliveryAddress": "123 Main St, City, State 12345",
  "totalAmount": 25.98,
  "createdAt": "2024-03-15T17:30:00Z",
  "updatedAt": "2024-03-15T17:30:00Z"
}
```

## 🔧 Available Backend APIs

**No backend changes needed!** These endpoints are ready:

```bash
# Get all orders for admin dashboard
GET /api/admin/orders
Authorization: Bearer <admin-token>

# Update order status  
PATCH /api/admin/orders/:orderId/status
Authorization: Bearer <admin-token>
Content-Type: application/json

# Body example:
{ "status": "confirmed" }

# Valid statuses: pending, confirmed, preparing, out_for_delivery, delivered, cancelled

# Quick confirm order
PATCH /api/admin/orders/:orderId/confirm
Authorization: Bearer <admin-token>
```

## 🎨 Angular Frontend Implementation

**File**: `frontend-angular/src/app/pages/admin-dashboard/admin-dashboard.component.ts`

### Required Angular Features:

**Real-Time Polling:**
- [ ] Use RxJS `interval()` to poll orders every 3-5 seconds
- [ ] Implement smart polling (pause when tab not visible)
- [ ] Handle polling subscription cleanup to prevent memory leaks
- [ ] Use `switchMap()` to prevent overlapping requests

**Order Status Management:**
- [ ] Create status update functions using admin API endpoints
- [ ] Implement optimistic UI updates for better UX
- [ ] Handle API errors with proper rollback
- [ ] Show loading states during status updates

**Real-Time UI Features:**
- [ ] Display orders in a responsive table/card layout
- [ ] Show real-time status badges with color coding
- [ ] Implement status transition buttons (confirm, update status)
- [ ] Auto-refresh timestamps and order counts

**Tab Visibility Optimization:**
- [ ] Use `document.visibilityState` to pause polling when tab inactive
- [ ] Resume polling when tab becomes visible again
- [ ] Prevent unnecessary API calls for performance

## ✅ Success Criteria

**You'll know it's working when:**

1. Order creation includes all required fields
2. Virtual totalAmount calculates correctly from items
3. Status transitions follow business rules
4. Database queries are optimized with proper indexes
5. All validation rules are enforced
6. Order history and admin queries work efficiently

## 🧪 Quick Verification

1. Create an order through the frontend checkout
2. Verify all fields are saved correctly in database
3. Check that totalAmount matches sum of item prices
4. Test status updates through admin panel
5. Verify order history displays correctly
6. Run the comprehensive test suite

## ⚠️ Common Gotchas

- Use virtual fields for calculated values (totalAmount)
- Add proper indexes for performance
- Validate status transitions
- Handle price changes over time with snapshots
- Ensure data integrity with proper validation
- Consider edge cases like empty orders or invalid prices

## 🔗 Schema Examples

```javascript
// Basic Order Schema Structure
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for totalAmount
orderSchema.virtual("totalAmount").get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});
```

## 🧪 Testing Your Implementation

Your Order model will be automatically tested across 5 engineering levels:

```bash
# Run the comprehensive test suite
cd backend
npm test order.model.test.js
```

**Test Levels:**

- **Level 1 (50-60%):** Basic schema validation
- **Level 2 (70-80%):** Business logic validation
- **Level 3 (85-90%):** Data integrity & constraints
- **Level 4 (90-95%):** Edge cases & security
- **Level 5 (95%+):** Performance & scalability

See `backend/tests/README.md` for detailed test descriptions and evaluation criteria.

</details>

---

# 🎯 **FEATURE 3: Order Complaint Form with Advanced Validation**

<details>

<summary><i>Open instructions</i></summary>

**Time Estimate**: 25 minutes

## 🎬 What You're Building

You'll implement an advanced complaint form system that demonstrates senior Angular reactive forms expertise:

- **Location**: Add complaint functionality to `/orders` page (Order History)
- **Advanced Validation**: Custom validators with real-time feedback
- **Reactive Forms**: Complex form state management
- **User Experience**: Form per order with modal/dropdown interface

## 📊 Expected Complaint Form Structure

The complaint form should collect this data:

```typescript
interface ComplaintForm {
  complaintType: 'Quality Issue' | 'Delivery Problem' | 'Wrong Order' | 'Other';
  description: string; // Required, min 20 characters
  email?: string; // Optional, must be valid email format if provided
  phone?: string; // Optional, must be valid Indian phone number if provided
}
```

**Validation Rules:**
- At least one contact method (email OR phone) is required
- Email must be in valid email format (e.g., user@example.com)
- Phone must be a valid Indian phone number (e.g., +919876543210 or 9876543210)
- Description must be at least 20 characters
```

## 🔧 Available Backend API

**No backend changes needed!** This endpoint is ready:

```bash
# Submit complaint for specific order
POST /api/orders/:orderId/complaint
Authorization: Bearer <token>
Content-Type: application/json

# Body example:
{
  "complaintType": "Quality Issue",
  "description": "Pizza was cold and toppings were missing",
  "email": "user@example.com",
  "phone": "+919876543210"
}

# Also available:
GET /api/orders/mine  # Get user's order history
```

## 🎨 Angular Frontend Implementation  

**File**: `frontend-angular/src/app/pages/order-history/order-history.component.ts`

### Required Angular Features:

**Reactive Forms Setup:**
- [ ] Create `FormGroup` with proper TypeScript typing
- [ ] Implement custom validators for description length (min 20 chars)
- [ ] Add email validation with proper regex pattern
- [ ] Add Indian phone number validation with regex pattern
- [ ] Implement cross-field validation (at least one contact method required)

**Advanced Validation:**
- [ ] Real-time validation with error display as user types
- [ ] Cross-field validation (at least one contact method required)
- [ ] Email format validation with proper error messages
- [ ] Indian phone number validation with proper error messages
- [ ] Form state management (dirty, touched, valid states)

**Form Submission:**
- [ ] Handle form submission with proper error handling
- [ ] Show loading states during API calls
- [ ] Success/error feedback with toast notifications
- [ ] Reset form after successful submission

## ✅ Success Criteria

**You'll know it's working when:**

1. Form validates email format correctly (user@example.com)
2. Form validates Indian phone numbers correctly (+919876543210 or 9876543210)
3. Form requires at least one contact method (email OR phone)
4. Description validation enforces minimum 20 characters
5. Form submission works with proper API integration
6. Error messages display clearly for each validation rule

## 🧪 Quick Verification

1. Navigate to Order History page
2. Click "File Complaint" on any order
3. Test email validation: enter invalid email (should show error)
4. Test phone validation: enter invalid Indian number (should show error)
5. Test contact requirement: leave both email and phone empty (should show error)
6. Test description validation: enter less than 20 characters (should show error)
7. Submit valid form and verify success message

## ⚠️ Common Gotchas

- Email validation should accept standard email formats (user@domain.com)
- Indian phone validation should accept: +919876543210, 9876543210, +91 9876543210
- At least one contact method (email OR phone) must be provided
- Description must be exactly 20+ characters (not just 20)
- Form should show real-time validation as user types
- Handle form submission errors gracefully with user feedback

## 🔗 API Examples

```bash
# Submit complaint with email
curl -X POST http://localhost:5000/api/orders/60d5f484f4b7a5b8c8f8e123/complaint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "complaintType": "Quality Issue",
    "description": "Pizza was cold and toppings were missing",
    "email": "user@example.com"
  }'

# Submit complaint with phone
curl -X POST http://localhost:5000/api/orders/60d5f484f4b7a5b8c8f8e123/complaint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "complaintType": "Delivery Problem",
    "description": "Order was delivered to wrong address and was late",
    "phone": "+919876543210"
  }'

# Submit complaint with both contact methods
curl -X POST http://localhost:5000/api/orders/60d5f484f4b7a5b8c8f8e123/complaint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "complaintType": "Wrong Order",
    "description": "Received different pizza than what was ordered",
    "email": "user@example.com",
    "phone": "+919876543210"
  }'

# Invalid complaint (missing contact method)
curl -X POST http://localhost:5000/api/orders/60d5f484f4b7a5b8c8f8e123/complaint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "complaintType": "Quality Issue",
    "description": "Pizza was cold"
  }'
```

</details>

---

## 📋 Submission Checklist

### What You Need to Complete:

- [ ] **Feature 1**: Smart Pizza Discovery with infinite scroll and order creation
- [ ] **Feature 2**: Real-time Admin Dashboard with polling and status updates
- [ ] **Feature 3**: Order Complaint Form with advanced reactive form validation

### Quality Standards:

- [ ] Modern Angular 18+ features used (signals, control flow, standalone components)
- [ ] Proper TypeScript implementation with strict typing
- [ ] RxJS operators used correctly with memory leak prevention
- [ ] Responsive design with Tailwind CSS
- [ ] Proper error handling and loading states

### Testing Your Implementation:

- [ ] Pizza search, filtering, and infinite scroll work smoothly
- [ ] Order creation integrates with cart system
- [ ] Admin dashboard shows real-time order updates
- [ ] Complaint forms validate properly and submit successfully
- [ ] No console errors or memory leaks

### Additional Requirements:

- [ ] Write **one comprehensive test** for any feature you choose
- [ ] Use NgRx Signals for state management
- [ ] Implement proper change detection optimization
- [ ] Handle edge cases and error states gracefully

---

# 🏆 Success Criteria

### Evaluation Criteria

Your challenge submission will be evaluated on:

**Angular Expertise (40%):**
- Modern Angular 18+ features (signals, control flow, standalone components)
- Proper TypeScript usage with strict mode
- Efficient change detection strategies
- Component architecture and reusability

**RxJS & State Management (25%):**
- Advanced RxJS operators and patterns
- Proper subscription management (no memory leaks)
- State synchronization across components
- Error handling and retry strategies

**Performance & UX (20%):**
- Smooth animations and transitions
- Loading states and error boundaries
- Responsive design implementation
- Real-time user experience

**Code Quality (15%):**
- Clean, readable, maintainable code
- Proper error handling
- Test implementation
- Following Angular style guide

---

# 🧪 Testing Commands

#### **Run All Tests**

```bash
# Backend tests (for evaluation)
cd backend
npm test

# Frontend tests (Angular)
cd frontend-angular
npm test
```

#### **Test Specific Features**

```bash
# Test backend functionality
cd backend
npm run feat-1:test  # Pizza API tests
npm run feat-2:test  # Order tests  
npm run feat-3:test  # Admin tests

# Test with coverage
npm test:coverage

# Watch mode for development
npm test:watch
```

#### **Write Your Own Test**

Remember to write **one comprehensive test** for any feature you implement. Example locations:
- `frontend-angular/src/app/shared/pizza-list/pizza-list.component.spec.ts`
- `frontend-angular/src/app/pages/admin-dashboard/admin-dashboard.component.spec.ts`
- `frontend-angular/src/app/pages/order-history/order-history.component.spec.ts`
# pizza-shop-challenge-angular
