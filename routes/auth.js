import express from "express";
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

router.post("/signup", postSignup);

router.get("/reset-password", getRestPassword);

router.post("/reset-password", postResetPassword);

router.get("/new-password/:token", getNewPassword);

router.post("/new-password", postNewPassword);

export { router };
