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
        email: {
          type: String,
          required: false,
        },
        phone: {
          type: String,
          required: false,
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
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true } // Include virtuals when converting to Object
  }
);

// Virtual for totalAmount - calculates from items
orderSchema.virtual("totalAmount").get(function () {
  if (!this.items || this.items.length === 0) {
    return 0;
  }
  return this.items.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
});

module.exports = mongoose.model("Order", orderSchema);
