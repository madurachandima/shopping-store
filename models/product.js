import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = [];

class Product {
    constructor(title,) {
        this.title = title
    }

    save() {
        products.push(this)
    }

    static fetchAll() {
        return products;
    }


}

export { Product }