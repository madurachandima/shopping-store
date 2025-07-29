import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log("Products fetched:", products);
      res.render("shop/product_list", {
        prods: products,
        pageTitle: "All Products",
        path: "/shop/products",
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log("Cart products fetched:", user.cart.items);
      const products = user.cart.items;
      res.render("shop/cart", {
        prods: products,
        pageTitle: "Your Cart",
        path: "/shop/cart",
        isAuthenticated: req.session.isLoggedIn,
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
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log("Orders fetched:", orders);
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/shop/orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
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
    .removeItemFromCart(prodId)
    .then((result) => {
      res.redirect("/shop/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: re.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/shop/orders");
    })
    .catch((err) => console.log(err));
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
