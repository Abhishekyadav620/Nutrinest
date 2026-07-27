const express = require("express");
const router = express.Router();
const { getProducts, getProduct, createProduct, getProductsBatch, updateProductStock } = require("../controllers/productController");

router.route("/").get(getProducts).post(createProduct);
router.route("/batch").post(getProductsBatch);
router.route("/:id").get(getProduct).patch(updateProductStock);

module.exports = router;
