import { MongoClient } from "mongodb";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://root:root%40123@shopingcartcluster.wzjy4q9.mongodb.net/?retryWrites=true&w=majority&appName=ShopingCartCluster"
  )
    .then((client) => {
      console.log("Connected to MongoDB");
      console.log(client);
      _db = client.db("shoppingcart");
      console.log("Connected to MongoDB");
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  console.log("call getDb");
  if (!_db) {
    throw new Error("No database found!");
  }
  return _db;
};

export { mongoConnect, getDb };
