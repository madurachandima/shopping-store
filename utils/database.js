import Sequelize from 'sequelize';

const sequelize = new Sequelize('shopping_db', 'user', '1234', {
  dialect: 'mysql',
  host: 'mysql',
  port: 3306
});

export { sequelize };