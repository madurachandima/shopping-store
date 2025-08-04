import express from "express";

import {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProductById,
  postEditProduct,
  deleteProductById,
} from "../controllers/admin_controller.js";

import { isAuth } from "../middleware/is_auth.js";

const router = express.Router();

router.get("/add-product", isAuth, getAddProduct);

router.get("/products", isAuth, getProducts);

router.get("/edit-product/:productId", isAuth, getEditProductById);

router.post("/delete-product", isAuth, deleteProductById);

router.post("/add-product", isAuth, postAddProduct);

router.post("/edit-product", isAuth, postEditProduct);

export { router };
