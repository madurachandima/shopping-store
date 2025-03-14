import express from "express";

import { getAddProduct, postAddProduct, getProducts } from '../controllers/admin_controller.js';




const router = express.Router();


router.get("/add-product", getAddProduct);

router.get("/products", getProducts);





router.post("/add-product", postAddProduct)

export { router };