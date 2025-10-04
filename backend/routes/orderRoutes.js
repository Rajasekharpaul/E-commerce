const express = require("express");
const {
  placeOrder,
  placeSingleOrder,
  getAllOrders,
} = require("../controllers/orderController");
const validateToken = require("../middleWare/validateTokenHandler");

const router = express.Router();

router.post("/", validateToken, placeOrder);
router.post("/:id", validateToken, placeSingleOrder);
router.get("/", validateToken, getAllOrders);

module.exports = router;
