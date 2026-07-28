require("dotenv").config();
const app = require("./app");
const { pingDatabase } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await pingDatabase();
    console.log("✓ Connected to MySQL");
  } catch (err) {
    console.warn(
      "⚠ Could not connect to MySQL at boot — the API will still start, " +
        "but any route touching the database will fail until this is fixed."
    );
    console.warn(`  ${err.message}`);
  }

  app.listen(PORT, () => {
    console.log(`✓ API listening on http://localhost:${PORT}`);
  });
}

start();
