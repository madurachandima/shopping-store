import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js"

const getProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/product_list', { prods: rows, pageTitle: "All Products", path: "/shop/products", })
    }).catch(error => {
        console.log(error);
    });

};

const getProductByProductId = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([rows, fieldData]) => {
            res.render('shop/product-details', { product: rows[0], pageTitle: "Product Details", path: "/shop/products", })
        })
        .catch(error => console.log(error));
};

const getIndex = (req, res, next) => {

    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/index', { prods: rows, pageTitle: "Index", path: "/", });
    }).catch(error => {
        console.log(error);
    });

};

const getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        const cartProducts = [];
        Product.fetchAll((products) => {
            for (var product of products) {
                const cartProductData = cart.products.find(cartProd => cartProd.id === product.id);
                console.log("cartProductData ----.>>>>>" + cartProductData);
                if (cartProductData) {
                    cartProducts.push({ cartProduct: product, qty: cartProductData.qty });
                }
            }
        });
        res.render('shop/cart', { prods: cartProducts, pageTitle: "Your Cart", path: "/shop/cart", })
    });
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