const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel.js");
const { isValidObjectId } = require("mongoose");

const checkIsIdValidObject = (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400).json({ error: "Invalid user ID" });
    console.log("id check", req.params.id);
    console.log("id-user check", req.user.id);
    return;
  }
};

const paymentController = {
  //@desc Get all payments
  //@route Get api/payments
  //@access private
  getPayments: asyncHandler(async (req, res) => {
    const payments = await Payment.find({ user_id: req.user.id });
    res.status(200).json(payments);
  }),

  //@desc Create new payments
  //@route POST api/payments
  //@access private
  createPayment: asyncHandler(async (req, res) => {
    checkIsIdValidObject(req, res);
    const { payments } = req.body;
    const user_id = req.params.id;

    // Check if payments array exists and has valid length
    if (
      !Array.isArray(payments) ||
      payments.length === 0 ||
      payments.length > 3
    ) {
      return res.status(400).json({
        error: "Invalid request body format. Please provide 1 to 3 payments.",
      });
    }

    try {
      // Delete existing payments for the user
      await Payment.deleteMany({ user_id });

      // Create new payments
      await Payment.create(
        payments.map((payment) => ({
          ...payment,
          user_id,
        }))
      );

      res.status(201).json({ message: "Payments created successfully" });
    } catch (err) {
      console.error("Error while creating payments:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }),

  //@desc Get payments
  //@route GET api/payments/:id
  //@access private
  getPayment: asyncHandler(async (req, res) => {
    checkIsIdValidObject(req, res);
    try {
      const user_id = req.params.id;
      const payment = await Payment.find({ user_id });
      if (!payment || payment === null) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error(error); // Log the entire error object
      res.status(400).json({ message: `Error finding payment` });
    }
  }),

  //@desc Update payment
  //@route PUT api/payments/:id
  //@access private
  updatePayment: asyncHandler(async (req, res) => {
    checkIsIdValidObject(req, res);
    console.log("zres", res);
    const userId = req.params.id; // Get the user ID from the parameters

    try {
      // Retrieve all payments associated with the user ID
      const payments = await Payment.find({ user_id: userId });

      // If no payments found, return a 404 error
      if (!payments || payments.length === 0) {
        return res
          .status(404)
          .json({ message: "No payments found for the user" });
      }

      // Extract complete statuses from the request body
      const completeStatuses = req.body.payments.map(
        (payment) => payment.complete
      );

      // Update each payment's "complete" status
      for (let i = 0; i < payments.length; i++) {
        console.log("Updating payment:", payments[i]._id);
        console.log("New complete status:", completeStatuses[i]);

        const updatedPayment = await Payment.findByIdAndUpdate(
          payments[i]._id,
          { complete: completeStatuses[i] }, // Update only the "complete" status
          { new: true }
        );

        console.log("Updated payment:", updatedPayment); // Log the updated payment

        // Update the payment in the array
        payments[i] = updatedPayment;
      }

      // Send the updated payments as response
      res.status(200).json(payments);
    } catch (error) {
      // Handle any errors
      console.error("Error while updating payments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }),

  //@desc Delete payment
  //@route Delete api/payments/:id
  //@access private
  deletePayment: asyncHandler(async (req, res) => {
    checkIsIdValidObject(req, res);
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        res.status(404);
        throw new Error("Payment not found");
      }
      if (payment.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User cannot delete other user's payments");
      }
      await Payment.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
      console.error(error); // Log the entire error object
      res.status(400).json({ message: "Error deleting payment" });
    }
  }),
};
module.exports = paymentController;
