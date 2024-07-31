// DataBase init script
// This script will delete the old database and create a new one

const sqlite3 = require('sqlite3').verbose();
// delete old database
const fs = require('fs');
try {
  fs.unlinkSync('./db/temperature.db');
  console.log('Old DataBase deleted successfully');
} catch (err) {
  console.error('Error deleting file:', err);
}
// create new database
const db = new sqlite3.Database('./db/temperature.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database opened');
  }
});
// create table
db.run('CREATE TABLE IF NOT EXISTS temperatures (id INTEGER PRIMARY KEY AUTOINCREMENT, temperature REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
  if (err) {
    console.error('Error creating table', err);
  }
});

db.close();
