import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid-transport";
import crypto from "crypto";

import { User } from "../models/user.js";
import { error } from "console";

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
          res.redirect("/auth/login");
          transporter.sendMail({
            to: email,
            from: "shop@node.com",
            subject: "Signup succeeded!",
            html: "<h1>You successfully signed up!</h1>",
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getRestPassword = (req, res, next) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/reset-password", {
    pageTitle: "Resret Password",
    path: "/reset-password",
    editing: false,
    errorMessage: error,
  });
};

const postResetPassword = (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    req.flash("error", "Email is required");
    return res.redirect("/auth/signup");
  }

  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      req.flash("error", "Something went wrong, please try again later");
      return res.redirect("/auth/reset-password");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/auth/reset-password");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "shop@node.com",
          subject: "Password Reset",
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/auth/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
        req.flash("error", "Something went wrong, please try again later");
        return res.redirect("/auth/reset-password");
      });
  });
};

const getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let error = req.flash("error");
      if (error.length > 0) {
        error = error[0];
      } else {
        error = null;
      }
      res.render("auth/reset-password", {
        pageTitle: "New Password",
        path: "/reset-password",
        editing: false,
        errorMessage: error,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Invalid or expired token");
      return res.redirect("/auth/reset-password");
    });
};

const postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  if (!password) {
    req.flash("error", "Password are required");
    return res.redirect("/auth/reset-password");
  }

  if (!userId || !passwordToken) {
    req.flash("error", "Invalid user");
    return res.redirect("/auth/reset-password");
  }

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      return res.redirect("/auth/login");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Something went wrong, please try again later");
      return res.redirect("/auth/reset-password");
    });
};

export {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getRestPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
};
