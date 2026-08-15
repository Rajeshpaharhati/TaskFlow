const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Create the data directory if it doesn't exist
const dataDirectory = path.join(__dirname, "../data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

// Use a custom database path for tests.
// Otherwise, use the normal application database.
const databasePath =
  process.env.TASKFLOW_DB_PATH ||
  path.join(dataDirectory, "taskflow.db");

const db = new Database(databasePath);

// Enable foreign key constraints
db.pragma("foreign_keys = ON");

// Load and execute database schema
const schemaPath = path.join(__dirname, "../database/schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

db.exec(schema);

module.exports = db;