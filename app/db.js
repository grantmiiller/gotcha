const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db.sqlite3');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, name TEXT, comment TEXT)");

  const stmt = db.prepare("INSERT INTO comments(name, comment) VALUES(?, ?)");
  stmt.run("Grant", "Hi everybody!");
  stmt.finalize();
});


db.close();

module.exports = db;
