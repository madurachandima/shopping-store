import { where } from "sequelize";
import { Product } from "../models/product.js";

const getAddProduct = (req, res, next) => {
  res.render("admin/admin-edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, price, imageUrl, description);
 
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/shop/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEditProductById = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;

  if (!editMode) {
    return res.redirect("/");
  }

  req.user
    .getProducts({ where: { id: prodId } })
    .then((product) => {
      console.log(product[0]["dataValues"]);
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/admin-edit-product", {
        product: product[0]["dataValues"],
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.update(
    {
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    },
    { where: { id: id } }
  )
    .then((result) => {
      console.log(result);
      if (result[0] === 1) {
        console.log("");
        return res.redirect("/admin/products");
      }
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/");
    });
};

const getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/admin-product-list", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteProductById = (req, res, next) => {
  const prodId = req.body.productId;

  Product.destroy({
    where: {
      id: prodId,
    },
  })
    .then((result) => {
      if (result[0] === 1) {
        console.log("Product deleted successfully");
      }
      return res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/admin/products");
    });
};

const deleteCartProductById = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/admin/products");
    }

    Product.deleteById(prodId, (response) => {
      res.redirect("/admin/products");
    });
  });
};

export {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProductById,
  postEditProduct,
  deleteProductById,
};
