const { pool } = require("../config/db");

async function findByUsername(username) {
  const [rows] = await pool.query(
    "SELECT id, name, username, password_hash, department FROM doctors WHERE username = ? LIMIT 1",
    [username]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, username, department FROM doctors WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

module.exports = { findByUsername, findById };
