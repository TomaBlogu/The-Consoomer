require("dotenv").config(); // Load .env variables

const Pool = require("pg").Pool;

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false // this can help avoid SSL certificate issues if you're on a development machine
      }
});

module.exports = pool;