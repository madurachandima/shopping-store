import express from "express";

import { getAddProduct, postAddProduct, getProducts, getEditProductById, postEditProduct } from '../controllers/admin_controller.js';




const router = express.Router();


router.get("/add-product", getAddProduct);

router.get("/products", getProducts);


router.get("/edit-product/:productId", getEditProductById);



router.post("/add-product", postAddProduct)

router.post("/edit-product", postEditProduct)

export { router };