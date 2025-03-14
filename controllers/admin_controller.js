import { Product } from "../models/product.js";

const getAddProduct = (req, res, next) => {
    res.render('admin/admin-add-product', { pageTitle: "Add Product", path: "/admin/add-product" })
};

const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect("/shop/products",);
};

const getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/admin-product-list', { prods: products, pageTitle: "Admin Products", path: "/admin/products" })
    });

};

export { getAddProduct, postAddProduct, getProducts };