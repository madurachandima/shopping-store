import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";

import { fileURLToPath } from "url";

import { router as adminRoutes } from "./routes/admin.js";
import { router as shopRoutes } from "./routes/shop.js";

import { pageNotFound } from "./controllers/error_controller.js";
import { User } from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
// if we rename views filter to "screens" this should be change like this
// app.set('views','screens')

app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6854e55be6464edb37a50cff")
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

app.use(pageNotFound);

mongoose
  .connect(
    "mongodb+srv://root:root%40123@shopingcartcluster.wzjy4q9.mongodb.net/shopping-app?retryWrites=true&w=majority&appName=ShopingCartCluster"
  )
  .then((_) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "John Doe",
          email: "aa@mail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  });
