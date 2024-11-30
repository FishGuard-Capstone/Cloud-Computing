const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.34.101.90.19,
  user: process.env.root,
  password: process.env.fishguard67,
  database: process.env.fishguarddb,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
