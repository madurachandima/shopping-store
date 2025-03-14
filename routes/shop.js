import express from 'express';


import { getProducts, getIndex, getCart, getCheckOut, getOrders } from '../controllers/shop_controller.js'


const router = express.Router();

router.get("/", getIndex)

router.get("/shop/products", getProducts)

router.get("/shop/cart", getCart)

router.get("/shop/checkout", getCheckOut)

router.get("/shop/orders", getOrders)

export { router };