import Database from 'better-sqlite3';
import path from 'path';

// Determine database type from environment variable
let DB_TYPE = (process.env.DATABASE_TYPE || 'sqlite').toLowerCase();

let db = null;
let pgPool = null;

// Initialize database connection based on type
if (DB_TYPE === 'postgresql' || DB_TYPE === 'postgres') {
    // PostgreSQL connection
    try {
        const { Pool } = require('pg');
        
        pgPool = new Pool({
            host: process.env.DATABASE_HOST || 'localhost',
            port: process.env.DATABASE_PORT || 5432,
            database: process.env.DATABASE_NAME || 'poll_project',
            user: process.env.DATABASE_USER || 'postgres',
            password: process.env.DATABASE_PASSWORD || '',
            ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });

        // Test connection
        pgPool.on('error', (err) => {
            console.error('Unexpected error on idle PostgreSQL client', err);
        });
    } catch (error) {
        console.error('PostgreSQL driver (pg) not installed. Please run: npm install pg');
        console.error('Falling back to SQLite...');
        // Fall back to SQLite
        DB_TYPE = 'sqlite';
        const dbPath = process.env.DATABASE_PATH 
            ? path.resolve(process.env.DATABASE_PATH)
            : path.join(process.cwd(), process.env.DATABASE_NAME || 'database.db');
        db = new Database(dbPath);
    }
} else {
    // SQLite connection
    const dbPath = process.env.DATABASE_PATH 
        ? path.resolve(process.env.DATABASE_PATH)
        : path.join(process.cwd(), process.env.DATABASE_NAME || 'database.db');
    
    db = new Database(dbPath);
}

// Database abstraction layer
class DatabaseAdapter {
    constructor() {
        this.type = DB_TYPE;
    }

    // Execute a query and return results
    async query(sql, params = []) {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            return await this._queryPostgres(sql, params);
        } else {
            return this._querySqlite(sql, params);
        }
    }

    // Execute a query and return a single row
    async queryOne(sql, params = []) {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            return await this._queryOnePostgres(sql, params);
        } else {
            return this._queryOneSqlite(sql, params);
        }
    }

    // Execute a query and return all rows
    async queryAll(sql, params = []) {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            return await this._queryAllPostgres(sql, params);
        } else {
            return this._queryAllSqlite(sql, params);
        }
    }

    // Execute an INSERT/UPDATE/DELETE and return the result
    async execute(sql, params = []) {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            return await this._executePostgres(sql, params);
        } else {
            return this._executeSqlite(sql, params);
        }
    }

    // Execute an INSERT and return the inserted ID
    async insert(sql, params = []) {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            return await this._insertPostgres(sql, params);
        } else {
            return this._insertSqlite(sql, params);
        }
    }

    // Convert SQLite-style SQL to PostgreSQL-style
    _convertSql(sql) {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            // Convert ? placeholders to $1, $2, etc.
            let paramIndex = 1;
            return sql.replace(/\?/g, () => `$${paramIndex++}`);
        }
        return sql;
    }

    // Convert SQLite AUTOINCREMENT to PostgreSQL SERIAL
    _convertCreateTable(sql) {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            // Replace INTEGER PRIMARY KEY AUTOINCREMENT with SERIAL PRIMARY KEY
            sql = sql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY');
            // Replace AUTOINCREMENT with SERIAL
            sql = sql.replace(/AUTOINCREMENT/g, '');
            // Replace INTEGER PRIMARY KEY with SERIAL PRIMARY KEY (if not already converted)
            sql = sql.replace(/INTEGER PRIMARY KEY(?!\s)/g, 'SERIAL PRIMARY KEY');
        }
        return sql;
    }

    // PostgreSQL query methods
    async _queryPostgres(sql, params) {
        const client = await pgPool.connect();
        try {
            const convertedSql = this._convertSql(sql);
            const result = await client.query(convertedSql, params);
            return result;
        } finally {
            client.release();
        }
    }

    async _queryOnePostgres(sql, params) {
        const result = await this._queryPostgres(sql, params);
        return result.rows[0] || null;
    }

    async _queryAllPostgres(sql, params) {
        const result = await this._queryPostgres(sql, params);
        return result.rows;
    }

    async _executePostgres(sql, params) {
        const result = await this._queryPostgres(sql, params);
        return {
            changes: result.rowCount || 0,
            lastInsertRowid: null // PostgreSQL doesn't use this pattern
        };
    }

    async _insertPostgres(sql, params) {
        // For PostgreSQL, we need to add RETURNING id to get the inserted ID
        if (sql.toUpperCase().includes('INSERT INTO')) {
            // Check if RETURNING is already in the query
            if (!sql.toUpperCase().includes('RETURNING')) {
                // Add RETURNING id at the end
                sql = sql.trim();
                if (sql.endsWith(';')) {
                    sql = sql.slice(0, -1);
                }
                sql += ' RETURNING id';
            }
        }
        
        const result = await this._queryPostgres(sql, params);
        return {
            lastInsertRowid: result.rows[0]?.id || null,
            changes: result.rowCount || 0
        };
    }

    // SQLite query methods
    _querySqlite(sql, params) {
        const stmt = db.prepare(sql);
        return stmt.run(...params);
    }

    _queryOneSqlite(sql, params) {
        const stmt = db.prepare(sql);
        return stmt.get(...params) || null;
    }

    _queryAllSqlite(sql, params) {
        const stmt = db.prepare(sql);
        return stmt.all(...params);
    }

    _executeSqlite(sql, params) {
        const stmt = db.prepare(sql);
        const result = stmt.run(...params);
        return {
            changes: result.changes || 0,
            lastInsertRowid: result.lastInsertRowid || null
        };
    }

    _insertSqlite(sql, params) {
        const stmt = db.prepare(sql);
        const result = stmt.run(...params);
        return {
            lastInsertRowid: result.lastInsertRowid || null,
            changes: result.changes || 0
        };
    }

    // Execute a CREATE TABLE statement (handles SQL differences)
    async createTable(sql) {
        const convertedSql = this._convertCreateTable(sql);
        if (this.type === 'postgresql' || this.type === 'postgres') {
            await this._queryPostgres(convertedSql, []);
        } else {
            db.prepare(convertedSql).run();
        }
    }

    // Get the raw database connection (for advanced use cases)
    getRawConnection() {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            return pgPool;
        } else {
            return db;
        }
    }

    // Close database connection
    async close() {
        if (this.type === 'postgresql' || this.type === 'postgres') {
            await pgPool.end();
        } else {
            db.close();
        }
    }
}

// Create and export singleton instance
const database = new DatabaseAdapter();

// Export the adapter
export default database;

// Also export for backward compatibility with existing code
export { db as sqliteDb };

