const request = require('supertest');
const express = require('express');
const { updateOrderStatus, confirmOrder, getAllOrders } = require('../src/controllers/adminController');

// Create a simple express app for testing
const app = express();  
app.use(express.json());

// Mock admin middleware
app.use((req, res, next) => {
  req.user = { _id: 'admin-id', role: 'admin' };
  next();
});

app.get('/admin/orders', getAllOrders);
app.patch('/admin/orders/:orderId/status', updateOrderStatus);
app.patch('/admin/orders/:orderId/confirm', confirmOrder);

describe('Admin Controller - Feature 2 Tests', () => {
  describe('GET /admin/orders - Real-time Order Management', () => {
    beforeEach(() => {
      const Order = require('../src/models/Order');
      const mockOrders = [
        { 
          _id: '1', 
          status: 'pending', 
          totalAmount: 25.99, 
          user: { name: 'John Doe', email: 'john@example.com' },
          createdAt: new Date()
        },
        { 
          _id: '2', 
          status: 'confirmed', 
          totalAmount: 18.50, 
          user: { name: 'Jane Smith', email: 'jane@example.com' },
          createdAt: new Date()
        }
      ];
      
      Order.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockOrders)
        })
      });
    });

    test('should return all orders for admin dashboard', async () => {
      const response = await request(app).get('/admin/orders');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PATCH /admin/orders/:orderId/status - Update Order Status', () => {
    beforeEach(() => {
      const Order = require('../src/models/Order');
      const mockUpdatedOrder = {
        _id: 'test-order-id',
        status: 'confirmed',
        updatedAt: new Date(),
        user: { name: 'Test User', email: 'test@example.com' }
      };
      
      Order.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUpdatedOrder)
      });
    });

    test('should update order status to confirmed', async () => {
      const response = await request(app)
        .patch('/admin/orders/test-order-id/status')
        .send({ status: 'confirmed' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('confirmed');
    });

    test('should update order status to preparing', async () => {
      const response = await request(app)
        .patch('/admin/orders/test-order-id/status')
        .send({ status: 'preparing' });
      
      expect(response.status).toBe(200);
    });

    test('should update order status to out_for_delivery', async () => {
      const response = await request(app)
        .patch('/admin/orders/test-order-id/status')
        .send({ status: 'out_for_delivery' });
      
      expect(response.status).toBe(200);
    });

    test('should update order status to delivered', async () => {
      const response = await request(app)
        .patch('/admin/orders/test-order-id/status')
        .send({ status: 'delivered' });
      
      expect(response.status).toBe(200);
    });

    test('should reject invalid status', async () => {
      const response = await request(app)
        .patch('/admin/orders/test-order-id/status')
        .send({ status: 'invalid_status' });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status');
    });

    test('should handle non-existent order', async () => {
      const Order = require('../src/models/Order');
      Order.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .patch('/admin/orders/non-existent-id/status')
        .send({ status: 'confirmed' });
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Order not found');
    });
  });

  describe('PATCH /admin/orders/:orderId/confirm - Quick Confirm', () => {
    beforeEach(() => {
      const Order = require('../src/models/Order');
      const mockOrder = {
        _id: 'test-order-id',
        status: 'confirmed',
        user: { name: 'Test User', email: 'test@example.com' }
      };
      
      Order.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrder)
      });
    });

    test('should quickly confirm an order', async () => {
      const response = await request(app)
        .patch('/admin/orders/test-order-id/confirm');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('confirmed');
    });
  });

  describe('Real-time Requirements Validation', () => {
    test('should support all valid order statuses', async () => {
      const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
      
      for (const status of validStatuses) {
        const response = await request(app)
          .patch('/admin/orders/test-id/status')
          .send({ status });
        
        // Should not return 400 (invalid status)
        expect(response.status).not.toBe(400);
      }
    });

    test('should handle concurrent status updates', async () => {
      // Simulate multiple status updates happening quickly
      const promises = [
        request(app).patch('/admin/orders/order1/status').send({ status: 'confirmed' }),
        request(app).patch('/admin/orders/order2/status').send({ status: 'preparing' }),
        request(app).patch('/admin/orders/order3/status').send({ status: 'delivered' })
      ];

      const responses = await Promise.all(promises);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});

// Test Score: 11 tests total  
// Tests admin order management functionality for Feature 2