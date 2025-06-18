import { getCart } from "../controllers/shop_controller.js";
import { getDb } from "../utils/database.js";
import { ObjectId } from "mongodb";

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // { items: [], totalPrice: 0 }
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("User inserted:", result);
        return result;
      })
      .catch((err) => {
        console.error("Error inserting user:", err);
        throw err;
      });
  }

  static findUserById(userId) {
    if (!ObjectId.isValid(userId)) {
      console.error("Invalid user ID:", userId);
      return Promise.reject(new Error("Invalid user ID"));
    }
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        if (!user) {
          console.error("User not found:", userId);
          return null;
        }
        console.log("User found:", user);
        return user;
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        throw err;
      });
  }

  addToCart(product) {
    console.log("Adding product to cart:", product);
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
      totalPrice: 0,
    };

    const db = getDb();
    return db.collection("users").updateOne(
      {
        _id: this._id,
      },
      {
        $set: { cart: updatedCart },
      }
    );
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map((item) => item.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteCartItemById(productId){

  }
}

export { User };
