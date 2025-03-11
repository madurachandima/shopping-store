import fs from 'fs'
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const products = [];

class Product {
    constructor(title,) {
        this.title = title
    }


    getPath = () => path.join(__dirname, 'data', 'products.json');

    save() {
        const p = this.getPath();

        fs.mkdir(path.dirname(p), { recursive: true }, (err) => {
            if (err) {
                console.error("Directory creation error:", err);
                return;
            }


            fs.readFile(p, "utf8", (err, fileContent) => {
                let products = [];

                if (err && err.code !== "ENOENT") {
                    console.error("Read error:", err);
                    return;
                }

                if (!err) {
                    try {
                        products = JSON.parse(fileContent);
                    } catch (parseError) {
                        console.error("JSON Parse Error:", parseError);
                        return;
                    }
                }


                products.push(this);


                fs.writeFile(p, JSON.stringify(products, null, 2), (err) => {
                    if (err) {
                        console.error("Write error:", err);
                    } else {
                        console.log("File updated successfully!");
                    }
                });
            });
        });




    }

    static fetchAll(cb) {
        const p = this.getPath();

        fs.readFile(p, (err, fileContent) => {
            console.log(fileContent);

            if (err) {
                cb([]);
            }
            cb(JSON.parse(fileContent));

        });


    }


}



export { Product }