import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { router as adminRouter, products } from './admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/", (req, res, next) => {

    // this is how render the shop.pub file
    // we dont use file extention like .pub becase in app js folder
    // alreday set the default render file type is pub

    res.render('shop', { prods: products, doctTitle: "Shop" })
})

export { router };