const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createOrder, getOrders, updateOrderStatus } = require("../controllers/orderControllers");

router.route("/").post(protect, createOrder).get(protect, getOrders);
router.patch("/:id/status", protect, updateOrderStatus);

module.exports = router;
