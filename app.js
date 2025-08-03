import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";

import { fileURLToPath } from "url";

import { router as adminRoutes } from "./routes/admin.js";
import { router as shopRoutes } from "./routes/shop.js";
import { router as authRoutes } from "./routes/auth.js";

import { pageNotFound } from "./controllers/error_controller.js";
import { User } from "./models/user.js";

const MONGODB_URI =
  "mongodb+srv://root:root%40123@shopingcartcluster.wzjy4q9.mongodb.net/shopping-app?retryWrites=true&w=majority&appName=ShopingCartCluster";

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
// if we rename views filter to "screens" this should be change like this
// app.set('views','screens')

app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret_value",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use("/auth", authRoutes);
app.use(pageNotFound);

mongoose
  .connect(MONGODB_URI)
  .then((_) => {
    app.listen(3000);
  })
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  });
