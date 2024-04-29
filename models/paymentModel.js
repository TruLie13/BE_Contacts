const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    paymentName: {
      type: String,
      required: [true, "Please add payment name"],
    },
    complete: {
      type: String,
      required: [true, "Please add payment email"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
