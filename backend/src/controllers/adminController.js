const Order = require("../models/Order");
const User = require("../models/User");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({
      status: 1, // pending orders first
      createdAt: -1, // then by most recent
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
};

// Confirm order (shortcut for updating status to confirmed)
const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "confirmed",
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to confirm order", error: err.message });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  confirmOrder,
};
