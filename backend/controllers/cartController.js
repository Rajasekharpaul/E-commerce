const express = require("express");
const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");

//@desc Add to cart
//@route POST/api/cart
//@access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      products: [{ productId, quantity }],
    });
  } else {
    const index = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (index > -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
  }
  await cart.save();
  res
    .status(200)
    .json({ success: true, message: "Product added to cart", cart });
});

//@desc Get cart items
//@route GET/api/cart
//@access Private
const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    res.status(404).json({ success: false, message: "Cart not found" });
    return;
  }
  
  res.status(200).json({ success: true, cart });
});

//@desc Update cart item
//@route PUT/api/cart/:productId
//@access Private
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return res
      .status(404)
      .json({ success: false, message: "Cart not found" });
  }

  const index = cart.products.findIndex(
    (p) => p.productId.toString() === productId
  );
  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in cart" });
  }

  cart.products[index].quantity = quantity;
  await cart.save();
  res.status(200).json({ success: true, message: "Cart item updated", cart });
});

//@desc Remove cart item
//@route DELETE/api/cart/:productId
//@access Private
const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return res
      .status(404)
      .json({ success: false, message: "Cart not found" });
  }

  const index = cart.products.findIndex(
    (p) => p.productId.toString() === productId
  );
  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in cart" });
  }

  cart.products.splice(index, 1);
  await cart.save();
  res.status(200).json({ success: true, message: "Cart item removed", cart });
});

// Define routes
module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
};
