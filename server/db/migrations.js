'use strict';

const Database = require('better-sqlite3');
const path = require('path');
const { SCHEMA } = require('./schema');

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'phenomenal.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.exec(SCHEMA);
  }
  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb, DB_PATH };
