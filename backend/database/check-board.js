const db = require("../src/database");

const boards = db.prepare("SELECT * FROM boards").all();

console.table(boards);

db.close();