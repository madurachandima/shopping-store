import fs from 'fs'
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE_PATH = path.join(__dirname, 'data', 'cart.json');

class Cart {
    static addProduct(id, productPrice) {
        const p = PRODUCTS_FILE_PATH;

        fs.mkdir(path.dirname(p), { recursive: true }, (err) => {
            if (err) {
                console.error("Directory creation error:", err);
                return;
            }


            fs.readFile(p, "utf8", (err, fileContent) => {
                let cart = { products: [], totalPrice: 0 };

                if (err && err.code !== "ENOENT") {
                    console.error("Read error:", err);
                    return;
                }

                if (!err) {
                    try {
                        cart = JSON.parse(fileContent);
                    } catch (parseError) {
                        console.error("JSON Parse Error:", parseError);
                        return;
                    }
                }


                const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
                const existingProduct = cart.products[existingProductIndex];
                let updatedProduct;

                if (existingProduct) {
                    updatedProduct = { ...existingProduct };
                    updatedProduct.qty = updatedProduct.qty + 1;
                    cart.products = [...cart.products];
                    cart.products[existingProductIndex] = updatedProduct;
                } else {
                    updatedProduct = { id: id, qty: 1 };
                    cart.products = [...cart.products, updatedProduct]
                }

                cart.totalPrice = cart.totalPrice + +productPrice;


                fs.writeFile(p, JSON.stringify(cart, null, 2), (err) => {
                    if (err) {
                        console.error("Write error:", err);
                    } else {
                        console.log("File updated successfully!");
                    }
                });
            });
        });
    }
}

export { Cart }