import Database from 'better-sqlite3';
import path from 'path';

// Load environment variables
const dbPath = process.env.DATABASE_PATH 
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(process.cwd(), process.env.DATABASE_NAME || 'database.db');

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
    title TEXT,
    url TEXT,
    image_url TEXT,
    used INTEGER,
    date TEXT,
    body TEXT,
    company TEXT
  )
`).run();

export default db;