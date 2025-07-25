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

### 1. Connect Mongo DB

![MongoDB Connection](https://juyrycyjglwfsllqrgpi.supabase.co/storage/v1/object/public/coding-challenges-files//mong-connection.jpg)

1.  Click on the mongo db extension
2.  Once the extension is opened, click the connect button.
3.  Enter the connection string `mongodb://pizzauser:pizzapass@mongo-db:27017/testdb?authSource=testdb` in the connection bar at the top.

### 2. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (Angular)
cd frontend-angular
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
  priority: 'low' | 'medium' | 'high';
  contactPreference: ('email' | 'phone')[]; // Optional array
}
```

## 🔧 Available Backend API

**No backend changes needed!** This endpoint is ready:

### Implementation Requirements:

#### **1. Payload Validation**

- [ ] Validate required fields: `orderId`, `status`, `timestamp`
- [ ] Verify orderId is valid MongoDB ObjectId
- [ ] Return 400 for missing/invalid fields

#### **2. Order Status Management**

- [ ] Find order by ID (return 404 if not found)
- [ ] Validate status transitions using allowed rules
- [ ] Update order status and optional fields
- [ ] Save statusUpdatedAt timestamp

#### **3. Status Transition Rules**

```javascript
const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [], // Final state
  cancelled: [], // Final state
};
```

#### **4. Error Handling**

- [ ] **400 Bad Request**: Missing required fields
- [ ] **404 Not Found**: Order not found
- [ ] **409 Conflict**: Invalid status transition
- [ ] **500 Internal Server Error**: Database errors

#### **5. Response Format**

```json
{
  "message": "Order status updated successfully",
  "orderId": "60d5f484f4b7a5b8c8f8e123",
  "newStatus": "confirmed"
}
```

### Test Your Backend:

```bash
# Test webhook endpoint
npm run feat-1:test
```

## ✅ Success Criteria

**You'll know it's working when:**

1. Valid status updates succeed (pending → confirmed)
2. Invalid transitions are rejected (delivered → pending)
3. Missing order IDs return 404
4. Missing required fields return 400
5. Database errors are handled gracefully

## 🧪 Quick Verification

1. Start server: `npm run dev`
2. Create an order (use frontend or admin panel)
3. Test valid transition: `pending → confirmed`
4. Test invalid transition: `confirmed → pending` (should fail)
5. Test missing order: use fake order ID (should return 404)
6. Check logs for webhook activity

## ⚠️ Common Gotchas

- Import Order model: `const Order = require('../models/Order')`
- Check transitions before updating status
- Use try/catch for database operations
- Return appropriate HTTP status codes
- Validate required fields before processing
- Don't allow backwards status transitions

## 🔗 API Examples

```bash
# Valid status update (pending → confirmed)
curl -X POST http://localhost:5000/api/webhook/delivery-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "60d5f484f4b7a5b8c8f8e123",
    "status": "confirmed",
    "timestamp": "2024-03-15T17:45:00Z"
  }'

# Invalid transition test (should return 409)
curl -X POST http://localhost:5000/api/webhook/delivery-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "60d5f484f4b7a5b8c8f8e123",
    "status": "pending",
    "timestamp": "2024-03-15T17:45:00Z"
  }'

# Missing fields test (should return 400)
curl -X POST http://localhost:5000/api/webhook/delivery-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "60d5f484f4b7a5b8c8f8e123"
  }'

# Non-existent order test (should return 404)
curl -X POST http://localhost:5000/api/webhook/delivery-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "000000000000000000000000",
    "status": "confirmed",
    "timestamp": "2024-03-15T17:45:00Z"
  }'
```

</details>

---

## 📋 Submission Checklist

### What You Need to Complete:

- [ ] **Task 1**: Complete filter/sort/pagination system
- [ ] **Task 2**: Design comprehensive Order schema
- [ ] **Task 3**: Implement webhook functionality

### Quality Standards:

- [ ] All TODO comments addressed
- [ ] Code follows existing patterns and conventions
- [ ] Proper error handling and validation
- [ ] Clean, readable code with good naming
- [ ] Features work as specified

### Testing Your Implementation:

- [ ] Filter and search functionality works
- [ ] Infinite scroll loads more pizzas
- [ ] Order creation and history work
- [ ] Webhook updates order status
- [ ] Admin dashboard displays correctly

---

# 🏆 Success Criteria

### Evaluation Criteria

Your challenge submission will be evaluated on:

- Clean, readable code with consistent formatting
- Proper naming conventions and code organization
- Following existing project patterns and conventions
- Appropriate use of modern JavaScript/React features
- Error handling and validation implementation

- **Feature 1**: Filter/Sort/Pagination functionality
- **Feature 2**: Order Model schema design and testing
- **Feature 3**: Webhook implementation and status updates
- All tests passing (especially Order model tests)
- Requirements met as specified in each task

---

# 🧪 Testing Commands

#### **Run All Tests**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

#### **Test Specific Features**

```bash
# Test Order Model implementation
cd backend
npm test order.model.test.js

# Test with coverage
npm test:coverage

# Watch mode for development
npm test:watch
```
# pizza-shop-challenge-angular
