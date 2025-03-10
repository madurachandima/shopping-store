const pageNotFound = (req, res, next) => {
    res.status(404).render('page-not-found', { pageTitle: "Page Not Found", path: ""})
};

export { pageNotFound };