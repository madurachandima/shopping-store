import { Product } from "../models/product.js";
import mongoose from "mongoose";

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

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user,
    /* 
    Assuming req.user is populated with 
    the user object and it only take the user ID
    */
  });

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

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/admin-edit-product", {
        product: product,
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid ID format");
    return res.redirect("/");
  }

  Product.findByIdAndUpdate(
    id,
    {
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    },
    { new: true }
  )
    .then((result) => {
      console.log("Product updated ", result);
      console.log("Product updated successfully");
      return res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/");
    });
};

const getProducts = (req, res, next) => {
  Product.find()
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

  Product.findByIdAndDelete(prodId)
    .then((result) => {
      console.log("Product deleted ", result);
      if (!result) {
        console.log("No product found with the given ID");
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
