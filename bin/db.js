// db conneting
const mysql = require('mysql');
require('dotenv').config();

const con=mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
  
module.exports = con;