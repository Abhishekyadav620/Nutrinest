const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  seedAdmin,
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/adminMiddleware");

router.post("/login", loginAdmin);
router.post("/seed", seedAdmin); // Use responsibly
router.get("/ping", (req, res) => res.json({ status: "Admin routes are online!", time: new Date() }));
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);

module.exports = router;
