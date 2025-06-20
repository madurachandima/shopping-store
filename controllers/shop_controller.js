import { Product } from "../models/product.js";

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log("Products fetched:", products);
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
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: "Product Details",
        path: "/shop/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log("Products fetched:", products);
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
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        prods: products,
        pageTitle: "Your Cart",
        path: "/shop/cart",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCheckOut = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/shop/checkout",
  });
};

const getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log("Orders fetched:", orders);
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/shop/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log("Error in getOrders:", err);
    });
};

const postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      console.log("Product found in postCart", product);
      console.log("User found in postCart", req.user);

      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("Product added to cart", result);
      res.redirect("/shop/cart");
    })
    .catch((err) => {
      console.log("Error in postCart:", err);
    });
};

const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .deleteCartItemById(prodId)
    .then((result) => {
      res.redirect("/shop/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      console.log("Order added:", result);
      res.redirect("/shop/orders");
    })
    .catch((err) => {
      console.log(err);
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
  postCartDeleteProduct,
  postOrder,
};
