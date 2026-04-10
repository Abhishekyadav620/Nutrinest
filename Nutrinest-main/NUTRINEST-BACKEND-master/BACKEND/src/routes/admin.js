const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  seedAdmin,
} = require("../controllers/adminController");
const { getAllOrders } = require("../controllers/orderControllers");
const { protectAdmin } = require("../middleware/adminMiddleware");

router.post("/login", loginAdmin);
router.post("/seed", seedAdmin); // Use responsibly
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);
router.get("/orders", protectAdmin, getAllOrders);

module.exports = router;
