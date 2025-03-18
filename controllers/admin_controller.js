import { Product } from "../models/product.js";

const getAddProduct = (req, res, next) => {
    res.render('admin/admin-edit-product', { pageTitle: "Add Product", path: "/admin/add-product", editing: false })
};

const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect("/shop/products",);
};


const getEditProductById = (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;

    if (!editMode) {
        return res.redirect("/");
    }


    Product.findById(prodId, (
        product
    ) => {
        if (!product) {
            return res.redirect("/");
        }
        res.render('admin/admin-edit-product', { product: product, pageTitle: "Edit Product", path: "/admin/edit-product", editing: editMode })
    });

};

const postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(id, title, imageUrl, description, price);
    product.save();
    res.redirect("/admin/products",);
};


const getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/admin-product-list', { prods: products, pageTitle: "Admin Products", path: "/admin/products" })
    });

};

const deleteProductById = (req, res, next) => {

    const prodId = req.body.productId;



    Product.findById(prodId, (
        product
    ) => {
        if (!product) {
            return res.redirect("/admin/products");
        }

        Product.deleteById(prodId, response => {
            res.redirect("/admin/products",);
        });

    });

};

export { getAddProduct, postAddProduct, getProducts, getEditProductById, postEditProduct, deleteProductById };