import Sequelize from "sequelize";

import { sequelize } from "../utils/database.js";
import e from "express";

const OrderItem = sequelize.define("orderItem", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
    
    },
  
});

export { OrderItem };