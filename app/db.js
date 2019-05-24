const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db_path = 'db.sqlite3';

try {
  fs.unlinkSync(db_path);
} catch (e) {
  // Ignore Error
}

const db = new sqlite3.Database(db_path);

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, name TEXT, comment TEXT)");

  createComment("Grant", "Hi everybody!");
  createComment("Baxter", "What an amazing and wonderful site!");
});

function createComment(name, comment, cb) {
  const stmt = db.prepare("INSERT INTO comments(name, comment) VALUES(?, ?)");
  stmt.run(name, comment);
  stmt.finalize(cb);
}

function getComments(cb) {
  const query = "SELECT * FROM comments";
  let comments = [];
  db.serialize(function() {
    db.all(query, function(err, rows) {
      if (err) { 
        throw err;
      }
      cb(rows);
    })
  });
}

module.exports = {
  db: db,
  getComments: getComments,
  createComment: createComment,
};
