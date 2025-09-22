import express from "express";
import { check, body } from "express-validator";
import { User } from "../models/user.js";

import {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getRestPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} from "../controllers/auth_controller.js";

const router = express.Router();

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter valid email!.")
    .custom((value, { req }) => {
      if (value === "test@mail.com") {
        throw new Error("This email is forbidden.");
      }
      return true;
    }),
  body("password", "Password must be at least 5 characters long.")
    .isLength({ min: 5 })
    .withMessage("confirmPassword")
    .custom((value, { req }) => {
      // if (value !== req.body.password) {
      //   throw new Error("Passwords have to match!");
      // }
      // return true;

      // async validation
      User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      });
    }),
  postSignup
);

router.get("/reset-password", getRestPassword);

router.post("/reset-password", postResetPassword);

router.get("/new-password/:token", getNewPassword);

router.post("/new-password", postNewPassword);

export { router };
