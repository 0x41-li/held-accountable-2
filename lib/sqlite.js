import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

// Example: create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    url TEXT,
    used INTEGER,
    date TEXT,
    body TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS enterprise_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    news_url TEXT,
    company_id TEXT,
    title TEXT,
    content TEXT,
    category TEXT,
    post_date TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS business_news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    news_url TEXT,
    image TEXT,
    title TEXT,
    content TEXT,
    category TEXT,
    post_date TEXT
  )
`).run();

export default db;