const express = require("express");
const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

//@desc place an order
//@route POST/api/order
//@access Private
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }
  const order = await Order.create({
    userId,
    products: cart.products,
    shippingAddress,
    paymentMethod,
  });
  await Cart.findOneAndDelete({ userId });
  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

//@desc place an single order directly from product page
//@route POST/api/order/:id
//@access Private
const placeSingleOrder = asyncHandler(async (req, res) => {
  const { productId, quantity, shippingAddress, paymentMethod } = req.body;
  const userId = req.user.id;
  const order = await Order.create({
    userId,
    products: [{ productId, quantity }],
    shippingAddress,
    paymentMethod,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

//@desc get all orders of a user
//@route GET/api/order
//@access Private
const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ userId });
  res.status(200).json({
    success: true,
    orders,
  });
});

module.exports = {
  placeOrder,
  placeSingleOrder,
  getAllOrders,
};
