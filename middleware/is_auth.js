const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/auth/login");
  }
  next();
};

export { isAuth };
