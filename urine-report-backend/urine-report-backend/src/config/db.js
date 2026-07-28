const mysql = require("mysql2/promise");

// A pool (not a single connection) so concurrent requests don't queue up
// behind one socket. Every controller imports this same pool instance.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // return DATE/DATETIME as strings, not JS Date objects
});

// Used by the health check route, and at boot to fail fast with a clear
// error instead of every request silently timing out against a dead DB.
async function pingDatabase() {
  const conn = await pool.getConnection();
  try {
    await conn.query("SELECT 1");
  } finally {
    conn.release();
  }
}

module.exports = { pool, pingDatabase };
