import { User } from "../models/user.js";

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    editing: false,
    isAuthenticated: req.isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  User.findById("6854e55be6464edb37a50cff")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
export { getLogin, postLogin, postLogout };
