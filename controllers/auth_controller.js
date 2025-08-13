import bcrypt from "bcryptjs";

import { User } from "../models/user.js";

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    editing: false,
    errorMessage: req.flash("error"),
  });
};

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/auth/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              return res.redirect("/");
            });
          } else {
            res.redirect("/auth/login");
          }
        })
        .catch((error) => {
          return res.redirect("/auth/login");
        });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/auth/login");
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    editing: false,
  });
};

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!email || !password) {
    return res.redirect("/auth/signup");
  }

  if (password !== confirmPassword) {
    // req.flash("error", "Passwords do not match");
    return res.redirect("/auth/signup");
  }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        // req.flash("error", "Email already exists");
        console.log("Email already exists");
        return res.redirect("/auth/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then(() => {
          res.redirect("/auth/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });

  // User.findById("6854e55be6464edb37a50cff")
  //   .then((user) => {
  //     // req.session.isLoggedIn = true;
  //     // req.session.user = user;
  //     // req.session.save((err) => {
  //     //   if (err) {
  //     //     console.log(err);
  //     //   }
  //     //   res.redirect("/");
  //     // });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
export { getLogin, postLogin, postLogout, getSignup, postSignup };
