const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/adminMiddleware");
const {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderControllers");

router.get("/", protectAdmin, getAllOrders);
router.put("/:id", protectAdmin, updateOrderStatus);
router.delete("/:id", protectAdmin, deleteOrder);

module.exports = router;
