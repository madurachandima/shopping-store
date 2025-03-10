const products = [];

const getAddProduct = (req, res, next) => {
    res.render('add-product', { pageTitle: "Add Product", path: "admin/add-product" })
};

const postAddProduct = (req, res, next) => {
    console.log(req.body);
    products.push({ title: req.body.title });
    res.redirect("/",);
};

const getProducts = (req, res, next) => {

    // this is how render the shop.pub file
    // we dont use file extention like .pub becase in app js folder
    // alreday set the default render file type is pub

    res.render('shop', { prods: products, pageTitle: "Shop", path: "/", })
};

export { getAddProduct, postAddProduct, getProducts };
