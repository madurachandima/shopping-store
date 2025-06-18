import express from "express";

import {
  getProducts,
  getIndex,
  getCart,
  getCheckOut,
  getOrders,
  getProductByProductId,
  postCart,
  postCartDeleteProduct,
  postOrder,
} from "../controllers/shop_controller.js";

const router = express.Router();

router.get("/", getIndex);

router.get("/shop/products", getProducts);

 router.get("/shop/product/:productId", getProductByProductId);

router.get("/shop/cart", getCart);

// router.get("/shop/checkout", getCheckOut);

// router.get("/shop/orders", getOrders);

router.post("/shop/cart", postCart);

// router.post("/shop/cart-delete-item", postCartDeleteProduct);

// router.post("/shop/create-order", postOrder);

export { router };
