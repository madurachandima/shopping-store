import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid-transport";

import { User } from "../models/user.js";

const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    auth: {
      api_key:
        "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",
    },
  })
);

const getLogin = (req, res, next) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    editing: false,
    errorMessage: error,
  });
};

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    req.flash("error", "Email and Password are required");
    return res.redirect("/auth/login");
  }

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
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    editing: false,
    errorMessage: error,
  });
};

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!email || !password) {
    req.flash("error", "Email and Password are required");
    return res.redirect("/auth/signup");
  }

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match");
    return res.redirect("/auth/signup");
  }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists");
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
          return transporter.sendMail({
            to: "madurachandima6@gmail.com",
            from: "wkmaduradias@gmail.com",
            subject: "Signup succeeded!",
            html: "<h1>You successfully signed up!</h1>",
          });
        })
        .then(() => {
          res.redirect("/auth/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
export { getLogin, postLogin, postLogout, getSignup, postSignup };
