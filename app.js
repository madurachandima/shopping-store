import express from "express";
import bodyParser from "body-parser";
import path from 'path';


import { fileURLToPath } from 'url';


import { router as adminRoutes } from './routes/admin.js';
import { router as shopRoutes } from './routes/shop.js';

import { pageNotFound } from './controllers/error_controller.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



app.set('view engine', 'ejs')
// if we rename views filter to "screens" this should be change like this
// app.set('views','screens') 

app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', pageNotFound);




app.listen(3000)