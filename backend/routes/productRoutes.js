const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const validateToken = require("../middleWare/validateTokenHandler");
const isAdmin = require("../middleWare/isAdmin");

// Public routes
router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

// Admin only routes
router.route("/").post(validateToken, isAdmin, createProduct);
router.route("/:id").put(validateToken, isAdmin, updateProduct);
router.route("/:id").delete(validateToken, isAdmin, deleteProduct);

module.exports = router;
