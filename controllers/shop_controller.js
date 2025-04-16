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
        product: product[0]["dataValues"],
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
  req.user
    .getCart()
    .then((cart) => {
      cart
        .getProducts()
        .then((cartProducts) => {
          res.render("shop/cart", {
            prods: cartProducts,
            pageTitle: "Your Cart",
            path: "/shop/cart",
          });
        })
        .catch((err) => {
          console.log(err);
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
  res.render("shop/orders", { pageTitle: "Your Orders", path: "/shop/orders" });
};

const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuenty = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuenty = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuenty },
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      res.redirect("/shop/cart");
    })
    .catch((err) => {
      console.log(err);
    });

  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  //   res.redirect("/");

  //   //res.render('shop/product-details', { product: product, pageTitle: "Product Details", path: "/shop/products", })
  // });
};

const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/shop/cart");
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
};
