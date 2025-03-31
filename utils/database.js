import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'mysql',
    user: "user",
    password: "1234",
    database: "shopping_db",
     port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

export const db = pool.promise();