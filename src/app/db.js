const Database = require('better-sqlite3');
// const db = new Database('todos.db', { verbose: console.log });
const db = new Database('todos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0
  )
`);

module.exports = db;