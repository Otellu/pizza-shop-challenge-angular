const Order = require("../models/Order.js");
const { simulateDeliveryUpdate } = require("../services/delivery.service.js");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Get order history for logged-in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: 1,
    });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Get details for a specific order (only if owned by user)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    console.log('=== CREATE ORDER DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    console.log('User ID:', req.user?._id);
    
    const { items, deliveryAddress } = req.body;

    if (!items || !deliveryAddress) {
      console.log('Missing required fields:', { items: !!items, deliveryAddress: !!deliveryAddress });
      return res.status(400).json({ message: "Missing required fields: items and deliveryAddress" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.log('Invalid or empty items array');
      return res.status(400).json({ message: "Items must be a non-empty array" });
    }

    if (!req.user || !req.user._id) {
      console.log('No authenticated user found');
      return res.status(401).json({ message: "Authentication required" });
    }

    const orderData = {
      user: req.user._id,
      items,
      deliveryAddress,
      status: "pending",
    };
    
    console.log('Creating order with data:', orderData);
    const order = new Order(orderData);

    await order.save();
    console.log('Order saved successfully:', order._id);


    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res
      .status(500)
      .json({ message: "Failed to create order", error: err.message });
  }
};

// Submit complaint for an order
const submitComplaint = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { complaintType, description, email, phone } = req.body;

    // Validate required fields
    if (!complaintType || !description) {
      return res.status(400).json({ message: "Missing required fields: complaintType and description" });
    }

    // Validate at least one contact method is provided
    if (!email && !phone) {
      return res.status(400).json({ message: "At least one contact method (email or phone) is required" });
    }

    // Verify order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Add complaint to order
    const complaint = {
      complaintType,
      description,
      email: email || undefined,
      phone: phone || undefined,
      submittedAt: new Date(),
      status: 'pending'
    };

    // Add complaint to order (you might want to create a separate Complaint model)
    order.complaint = complaint;
    await order.save();

    res.status(201).json({ 
      message: "Complaint submitted successfully", 
      complaint,
      orderId 
    });

  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to submit complaint", error: err.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  getMyOrders,
  getOrderById,
  submitComplaint,
};
