const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController.js");
const validateToken = require("../middleware/validateTokenHandler.js");

router.use(validateToken);
router.route("/").get(paymentController.getPayments);

router
  .route("/:id")
  .get(paymentController.getPayment)
  .post(paymentController.createPayment)
  .put(paymentController.updatePayment)
  .delete(paymentController.deletePayment);

module.exports = router;
