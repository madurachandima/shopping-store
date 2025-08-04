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
import { isAuth } from "../middleware/is_auth.js";

const router = express.Router();

router.get("/", getIndex);

router.get("/shop/products", getProducts);

router.get("/shop/product/:productId", getProductByProductId);

router.get("/shop/cart", isAuth, getCart);

router.get("/shop/orders", isAuth, getOrders);

router.post("/shop/cart", isAuth, postCart);

router.post("/shop/cart-delete-item", isAuth, postCartDeleteProduct);

router.post("/shop/create-order", isAuth, postOrder);

export { router };
