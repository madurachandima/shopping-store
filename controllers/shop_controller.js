import { Product } from "../models/product.js";


const getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product_list', { prods: products, pageTitle: "All Products", path: "/shop/products", })
    });
};

const getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', { prods: products, pageTitle: "Index", path: "/", })
    });
};

const getCart = (req, res, next) => {
    res.render('shop/cart', { pageTitle: "Your Cart", path: "/shop/cart", })
};

const getCheckOut = (req, res, next) => {
    res.render('shop/checkout', { pageTitle: "Checkout", path: "/shop/checkout", })
};


const getOrders = (req, res, next) => {
    res.render('shop/orders', { pageTitle: "Your Orders", path: "/shop/orders", })
};

export { getProducts, getIndex, getCart, getCheckOut,getOrders };