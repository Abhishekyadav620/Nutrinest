const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { protectAdmin } = require("../middleware/adminMiddleware");
const { createOrder, getOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderControllers");

router.route("/").post(protect, createOrder).get(protect, getOrders);
router.get("/all", protectAdmin, getAllOrders);
router.patch("/:id/status", protectAdmin, updateOrderStatus);
router.delete("/:id", protectAdmin, deleteOrder);

module.exports = router;
