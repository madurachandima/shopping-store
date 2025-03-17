import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js"

const getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product_list', { prods: products, pageTitle: "All Products", path: "/shop/products", })
    });
};

const getProductByProductId = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, (
        product
    ) => {
        res.render('shop/product-details', { product: product, pageTitle: "Product Details", path: "/shop/products", })
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


const postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId, (
        product
    ) => {
    
        Cart.addProduct(prodId, product.price);
        res.redirect('/');

        //res.render('shop/product-details', { product: product, pageTitle: "Product Details", path: "/shop/products", })
    });
};

export { getProducts, getIndex, getCart, getCheckOut, getOrders, getProductByProductId, postCart };