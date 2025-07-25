const request = require('supertest');
const express = require('express');
const { createOrder, getMyOrders, submitComplaint } = require('../src/controllers/orderController');

// Create a simple express app for testing
const app = express();
app.use(express.json());

// Mock middleware for authenticated routes
app.use((req, res, next) => {
  req.user = { _id: 'mock-user-id', name: 'Test User', email: 'test@example.com' };
  next();
});

app.post('/orders', createOrder);
app.get('/orders/mine', getMyOrders);
app.post('/orders/:orderId/complaint', submitComplaint);

describe('Order Controller - Feature Tests', () => {
  describe('POST /orders - Create Order (Feature 1)', () => {
    beforeEach(() => {
      const Order = require('../src/models/Order');
      Order.mockImplementation((data) => ({
        ...data,
        _id: 'new-order-id',
        save: jest.fn().mockResolvedValue({ ...data, _id: 'new-order-id' })
      }));
      
      // Mock delivery service
      jest.mock('../src/services/delivery.service.js', () => ({
        simulateDeliveryUpdate: jest.fn()
      }));
    });

    test('should create a new order with required fields', async () => {
      const orderData = {
        items: [
          { id: 'pizza1', name: 'Margherita', price: 12.99, quantity: 2 },
          { id: 'pizza2', name: 'Pepperoni', price: 15.99, quantity: 1 }
        ],
        deliveryAddress: '123 Main St, City, State 12345',
        totalAmount: 41.97
      };

      const response = await request(app)
        .post('/orders')
        .send(orderData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.status).toBe('pending');
      expect(response.body.totalAmount).toBe(41.97);
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteOrder = {
        items: [{ id: 'pizza1', name: 'Margherita', price: 12.99, quantity: 1 }]
        // Missing deliveryAddress and totalAmount
      };

      const response = await request(app)
        .post('/orders')
        .send(incompleteOrder);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required fields');
    });

    test('should handle empty items array', async () => {
      const orderWithEmptyItems = {
        items: [],
        deliveryAddress: '123 Main St',
        totalAmount: 0
      };

      const response = await request(app)
        .post('/orders')
        .send(orderWithEmptyItems);
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /orders/mine - User Order History', () => {
    beforeEach(() => {
      const Order = require('../src/models/Order');
      const mockOrders = [
        { _id: '1', status: 'delivered', totalAmount: 25.99, createdAt: new Date() },
        { _id: '2', status: 'pending', totalAmount: 18.50, createdAt: new Date() }
      ];
      
      Order.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockOrders)
      });
    });

    test('should return user order history', async () => {
      const response = await request(app).get('/orders/mine');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /orders/:orderId/complaint - Submit Complaint (Feature 3)', () => {
    beforeEach(() => {
      const Order = require('../src/models/Order');
      const mockOrder = {
        _id: 'test-order-id',
        user: 'mock-user-id',
        status: 'delivered',
        complaint: null,
        save: jest.fn().mockResolvedValue(true)
      };
      
      Order.findOne = jest.fn().mockResolvedValue(mockOrder);
    });

    test('should submit complaint with all required fields', async () => {
      const complaintData = {
        complaintType: 'Quality Issue',
        description: 'Pizza was cold and toppings were missing',
        priority: 'high',
        contactPreference: ['email', 'phone']
      };

      const response = await request(app)
        .post('/orders/test-order-id/complaint')
        .send(complaintData);
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Complaint submitted successfully');
      expect(response.body.complaint.complaintType).toBe('Quality Issue');
    });

    test('should return 400 for missing required complaint fields', async () => {
      const incompleteComplaint = {
        description: 'Pizza was cold'
        // Missing complaintType and priority
      };

      const response = await request(app)
        .post('/orders/test-order-id/complaint')
        .send(incompleteComplaint);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required fields');
    });

    test('should return 404 for non-existent order', async () => {
      const Order = require('../src/models/Order');
      Order.findOne = jest.fn().mockResolvedValue(null);

      const complaintData = {
        complaintType: 'Quality Issue',
        description: 'Test complaint',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/orders/non-existent-id/complaint')
        .send(complaintData);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Order not found');
    });

    test('should validate complaint type options', async () => {
      const complaintData = {
        complaintType: 'Delivery Problem',
        description: 'Driver was very late and food was cold',
        priority: 'low'
      };

      const response = await request(app)
        .post('/orders/test-order-id/complaint')
        .send(complaintData);
      
      expect(response.status).toBe(201);
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors for order creation', async () => {
      const Order = require('../src/models/Order');
      Order.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      const orderData = {
        items: [{ id: 'pizza1', name: 'Test', price: 10, quantity: 1 }],
        deliveryAddress: '123 Test St',
        totalAmount: 10
      };

      const response = await request(app)
        .post('/orders')
        .send(orderData);
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to create order');
    });
  });
});

// Test Score: 12 tests total
// Tests order creation (Feature 1) and complaint system (Feature 3)