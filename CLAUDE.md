# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack Pizza Shop Challenge application with:
- **Frontend**: Angular 18 application in `frontend-angular/` with standalone components, Tailwind CSS, and NgRx Signals
- **Backend**: Node.js/Express API in `backend/` with MongoDB/Mongoose, JWT authentication, and webhook support

## Development Commands

### Frontend (Angular)
```bash
cd frontend-angular
npm start           # Start development server (ng serve)
npm run build       # Build for production
npm test            # Run Karma/Jasmine tests
```

### Backend (Node.js)
```bash
cd backend
npm run dev         # Start development server with nodemon
npm test            # Run all Jest tests
npm run feat-1:test # Test pizza controller features
npm run feat-2:test # Test order model
npm run feat-3:test # Test webhook controller
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Database Setup
MongoDB connection string: `mongodb://pizzauser:pizzapass@mongo-db:27017/testdb?authSource=testdb`

## Architecture Overview

### Frontend Architecture
- **Standalone Components**: Uses Angular 18 standalone components (no NgModules)
- **Routing**: Lazy-loaded routes with guards for auth/admin protection
- **State Management**: NgRx Signals for reactive state management
- **Authentication**: JWT-based with interceptors and route guards
- **Styling**: Tailwind CSS with component-specific styles

Key directories:
- `src/app/pages/`: Route components (landing, login, checkout, admin, etc.)
- `src/app/services/`: API, auth, cart, and toast services
- `src/app/shared/`: Reusable components (navbar, pizza-list, etc.)
- `src/app/guards/`: Authentication and authorization guards

### Backend Architecture
- **MVC Pattern**: Controllers, models, routes, middleware structure
- **Authentication**: JWT tokens with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **API Routes**: RESTful endpoints for pizzas, orders, auth, admin, webhooks

Key directories:
- `src/controllers/`: Business logic (pizza, order, auth, admin, webhook)
- `src/models/`: Mongoose schemas (User, Pizza, Order)
- `src/routes/`: Express route definitions
- `src/middleware/`: Auth, admin, and logging middleware
- `src/services/`: Business services (delivery service)

## Key Features to Implement

The challenge involves implementing three main features:

1. **Filter/Sort/Pagination**: Pizza browsing with diet filters, price sorting, and infinite scroll
2. **Order Model Design**: Comprehensive order schema with status tracking and validation
3. **Webhook Implementation**: Order status updates from external delivery services

## Authentication System

- **User Roles**: Regular users and administrators
- **Guards**: `authGuard` for authenticated routes, `adminGuard` for admin-only routes
- **Interceptors**: Automatic JWT token attachment and 401 error handling
- **Test Credentials**:
  - User: `user@example.com` / `test1234`
  - Admin: `admin@example.com` / `test1234`

## Testing Strategy

- **Frontend**: Karma + Jasmine for unit tests
- **Backend**: Jest with MongoDB Memory Server for integration tests
- **Specific Feature Tests**: Use `npm run feat-X:test` commands for individual feature validation

## Development Patterns

- Follow existing component structure and naming conventions
- Use TypeScript with Zod for validation on frontend
- Implement proper error handling and loading states
- Use Mongoose virtuals and middleware for calculated fields
- Follow RESTful API conventions for endpoints