const express = require("express");
const {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");
const validateToken = require("../middleWare/validateTokenHandler");

const router = express.Router();

router.post("/", validateToken, addToCart);
router.get("/", validateToken, getCartItems);
router.put("/:productId", validateToken, updateCartItem);
router.delete("/:productId", validateToken, removeCartItem);

module.exports = router;
