require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function migrate() {
  const schemaPath = path.join(__dirname, "..", "..", "sql", "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  // No `database` here on purpose — schema.sql itself creates the database
  // (CREATE DATABASE IF NOT EXISTS), so this connection can't select one
  // that might not exist yet on a first run.
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    console.log("Running schema.sql ...");
    await connection.query(schemaSql);
    console.log("✓ Schema applied — database and tables are ready.");
  } finally {
    await connection.end();
  }
}

migrate().catch((err) => {
  console.error("✗ Migration failed:");
  console.error(err.message);
  process.exit(1);
});
