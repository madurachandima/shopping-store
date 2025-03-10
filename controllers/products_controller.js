import { Product } from "../models/product.js";

const getAddProduct = (req, res, next) => {
    res.render('add-product', { pageTitle: "Add Product", path: "admin/add-product" })
};

const postAddProduct = (req, res, next) => {

    const product = new Product(req.body.title);
    product.save();

    res.redirect("/",);
};

const getProducts = (req, res, next) => {
    const products = Product.fetchAll();

    res.render('shop', { prods: products, pageTitle: "Shop", path: "/", })
};

export { getAddProduct, postAddProduct, getProducts };
