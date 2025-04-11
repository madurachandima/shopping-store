import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js";

const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product_list", {
        prods: products,
        pageTitle: "All Products",
        path: "/shop/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProductByProductId = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findAll({ where: { id: prodId } })
    .then((product) => {
      res.render("shop/product-details", {
        product: product[0]['dataValues'],
        pageTitle: "Product Details",
        path: "/shop/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Index",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    const cartProducts = [];
    Product.fetchAll((products) => {
      for (var product of products) {
        const cartProductData = cart.products.find(
          (cartProd) => cartProd.id === product.id
        );
        console.log("cartProductData ----.>>>>>" + cartProductData);
        if (cartProductData) {
          cartProducts.push({ cartProduct: product, qty: cartProductData.qty });
        }
      }
    });
    res.render("shop/cart", {
      prods: cartProducts,
      pageTitle: "Your Cart",
      path: "/shop/cart",
    });
  });
};

const getCheckOut = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/shop/checkout",
  });
};

const getOrders = (req, res, next) => {
  res.render("shop/orders", { pageTitle: "Your Orders", path: "/shop/orders" });
};

const postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
    res.redirect("/");

    //res.render('shop/product-details', { product: product, pageTitle: "Product Details", path: "/shop/products", })
  });
};

export {
  getProducts,
  getIndex,
  getCart,
  getCheckOut,
  getOrders,
  getProductByProductId,
  postCart,
};
