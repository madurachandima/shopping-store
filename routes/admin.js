import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(__dirname, '../','views','add-product.html'));
})

router.post("/add-product", (req, res, next) => {
    console.log(req.body);
    products.push({title : req.body.title});
    res.redirect("/");
})

export {router,products};