// import Sequelize from "sequelize";
import { getDb } from "../utils/database.js";
import { ObjectId } from "mongodb";

class Product {
  constructor(title, price, imageUrl, description, id) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new ObjectId(id) : null;
  }
  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log("Product inserted:", result);
        return result;
      })
      .catch((err) => {
        console.error("Error inserting product:", err);
        throw err;
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("Products fetched:", products);
        return products;
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }

  static findById(prodId) {
    if (!ObjectId.isValid(prodId)) {
      console.error("Invalid product ID:", prodId);
      return Promise.reject(new Error("Invalid product ID"));
    }
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: new ObjectId(prodId) })

      .then((product) => {
        console.log("Product found:", product);
        return product;
      })
      .catch((err) => {
        console.error("Error finding product:", err);
      });
  }

  static deleteById(prodId) {
    if (!ObjectId.isValid(prodId)) {
      console.error("Invalid product ID:", prodId);
      return Promise.reject(new Error("Invalid product ID"));
    }
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(prodId) })
      .then((result) => {
        console.log("Product deleted:", result);
        return result;
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
        throw err;
      });
  }
}

export { Product };

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
// });

// export { Product };
