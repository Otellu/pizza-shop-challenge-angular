const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // TODO: Add user field - ObjectId reference to User model (required)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    complaint: {
      type: {
        complaintType: {
          type: String,
          enum: ["Quality Issue", "Delivery Problem", "Wrong Order", "Other"],
          required: true,
        },
        description: {
          type: String,
          required: true,
          minlength: 20,
        },
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
          required: true,
        },
        contactPreference: {
          type: [String],
          enum: ["email", "phone"],
          default: [],
        },
        status: {
          type: String,
          enum: ["pending", "resolved", "rejected"],
          default: "pending",
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
      default: null,
    },
  },
  {
    timestamps: true, // This will auto-generate createdAt and updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);
