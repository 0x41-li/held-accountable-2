import database from '../../../lib/database';

// Initialize tables - create if they don't exist
async function initializeTables() {
    // Companies table
    await database.createTable(`
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            url VARCHAR(500),
            logo VARCHAR(500),
            created_at VARCHAR(50),
            updated_at VARCHAR(50)
        )
    `);

    // Company polls table
    await database.createTable(`
        CREATE TABLE IF NOT EXISTS company_polls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url VARCHAR(500),
            category VARCHAR(255),
            company_id INTEGER NOT NULL,
            image_url VARCHAR(500),
            title VARCHAR(500),
            content TEXT,
            status INTEGER,
            vote_result INTEGER,
            comment_count INTEGER,
            section_ids VARCHAR(500),
            section_titles VARCHAR(500),
            created_at VARCHAR(50),
            updated_at VARCHAR(50)
        )
    `);

    // Add new columns to existing tables if they don't exist (migration)
    // Try to add columns - ignore errors if they already exist
    try {
        await database.execute('ALTER TABLE company_polls ADD COLUMN section_ids VARCHAR(500)');
    } catch (e) {
        // Column might already exist, ignore error
    }
    try {
        await database.execute('ALTER TABLE company_polls ADD COLUMN section_titles VARCHAR(500)');
    } catch (e) {
        // Column might already exist, ignore error
    }

    // Company poll votes table
    await database.createTable(`
        CREATE TABLE IF NOT EXISTS company_poll_votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            poll_id INTEGER NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            vote INTEGER,
            points INTEGER,
            created_at VARCHAR(50),
            updated_at VARCHAR(50),
            FOREIGN KEY (poll_id) REFERENCES company_polls(id)
        )
    `);

    // Company poll comments table
    await database.createTable(`
        CREATE TABLE IF NOT EXISTS company_poll_comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            poll_id INTEGER NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            user_name VARCHAR(255),
            user_logo VARCHAR(500),
            parent_id INTEGER,
            content VARCHAR(1000),
            created_at VARCHAR(50),
            updated_at VARCHAR(50),
            FOREIGN KEY (poll_id) REFERENCES company_polls(id),
            FOREIGN KEY (parent_id) REFERENCES company_poll_comments(id)
        )
    `);
}

// Initialize tables on module load (async initialization)
let tablesInitialized = false;
const initPromise = initializeTables().then(() => {
    tablesInitialized = true;
}).catch(err => {
    console.error('Error initializing database tables:', err);
});

// Helper to ensure tables are initialized before operations
async function ensureInitialized() {
    if (!tablesInitialized) {
        await initPromise;
    }
}

// ==================== Companies Service ====================

export const companyService = {
    // Create a new company
    create: async (companyData) => {
        await ensureInitialized();
        const { name, url, logo } = companyData;
        const now = new Date().toISOString();
        const result = await database.insert(
            `INSERT INTO companies (name, url, logo, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
            [name, url || null, logo || null, now, now]
        );
        return { id: result.lastInsertRowid, ...companyData, created_at: now, updated_at: now };
    },

    // Get company by ID
    getById: async (id) => {
        await ensureInitialized();
        return await database.queryOne('SELECT * FROM companies WHERE id = ?', [id]);
    },

    // Get company by url
    getByUrl: async (url) => {
        await ensureInitialized();
        return await database.queryOne('SELECT * FROM companies WHERE url = ?', [url]);
    },

    // Get all companies
    getAll: async () => {
        await ensureInitialized();
        return await database.queryAll('SELECT * FROM companies ORDER BY created_at DESC');
    },

    // Update company
    update: async (id, companyData) => {
        await ensureInitialized();
        const { name, url, logo } = companyData;
        const now = new Date().toISOString();
        await database.execute(
            `UPDATE companies SET name = ?, url = ?, logo = ?, updated_at = ? WHERE id = ?`,
            [name, url || null, logo || null, now, id]
        );
        return await companyService.getById(id);
    },

    // Delete company
    delete: async (id) => {
        await ensureInitialized();
        return await database.execute('DELETE FROM companies WHERE id = ?', [id]);
    }
};

// ==================== Company Polls Service ====================

export const companyPollService = {
    // Create a new poll
    create: async (pollData) => {
        await ensureInitialized();
        const { url, category, company, image_url, title, content, status, vote_result, comment_count, section_ids, section_titles } = pollData;
        const now = new Date().toISOString();
        
        // Convert arrays to strings if needed
        const sectionIdsStr = Array.isArray(section_ids) ? JSON.stringify(section_ids) : (section_ids || null);
        const sectionTitlesStr = Array.isArray(section_titles) ? JSON.stringify(section_titles) : (section_titles || null);
        
        const result = await database.insert(
            `INSERT INTO company_polls (url, category, company_id, image_url, title, content, status, vote_result, comment_count, section_ids, section_titles, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                url || null,
                category || null,
                company || null,
                image_url || null,
                title || null,
                content || null,
                status || 0,
                vote_result || 0,
                comment_count || 0,
                sectionIdsStr,
                sectionTitlesStr,
                now,
                now
            ]
        );
        return { id: result.lastInsertRowid, ...pollData, created_at: now, updated_at: now };
    },

    // Get poll by ID
    getById: async (id) => {
        await ensureInitialized();
        return await database.queryOne('SELECT * FROM company_polls WHERE id = ?', [id]);
    },

    // Get all polls with pagination
    getAll: async (filters = {}, pagination = {}) => {
        await ensureInitialized();
        let query = 'SELECT * FROM company_polls WHERE 1=1';
        const params = [];

        if (filters.company) {
            query += ' AND company_id = ?';
            params.push(filters.company);
        }
        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }
        if (filters.status !== undefined) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY created_at DESC';

        // Add pagination (both SQLite and PostgreSQL use LIMIT/OFFSET)
        if (pagination.limit) {
            query += ' LIMIT ?';
            params.push(pagination.limit);
            if (pagination.offset) {
                query += ' OFFSET ?';
                params.push(pagination.offset);
            }
        }

        return await database.queryAll(query, params);
    },

    // Get total count of polls matching filters
    getCount: async (filters = {}) => {
        await ensureInitialized();
        let query = 'SELECT COUNT(*) as count FROM company_polls WHERE 1=1';
        const params = [];

        if (filters.company) {
            query += ' AND company_id = ?';
            params.push(filters.company);
        }
        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }
        if (filters.status !== undefined) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        const result = await database.queryOne(query, params);
        // Handle both SQLite (returns count as number) and PostgreSQL (returns count as string)
        const count = typeof result?.count === 'string' ? parseInt(result.count) : (result?.count || 0);
        return count;
    },

    // Update poll
    update: async (id, pollData) => {
        await ensureInitialized();
        const fields = [];
        const values = [];
        const allowedFields = ['url', 'category', 'company_id', 'image_url', 'title', 'content', 'status', 'vote_result', 'comment_count', 'section_ids', 'section_titles'];

        for (const [key, value] of Object.entries(pollData)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                // Convert arrays to strings for section_ids and section_titles
                if ((key === 'section_ids' || key === 'section_titles') && Array.isArray(value)) {
                    values.push(JSON.stringify(value));
                } else {
                    values.push(value);
                }
            }
        }

        if (fields.length === 0) {
            return await companyPollService.getById(id);
        }

        fields.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(id);

        await database.execute(`UPDATE company_polls SET ${fields.join(', ')} WHERE id = ?`, values);
        return await companyPollService.getById(id);
    },

    // Delete poll
    delete: async (id) => {
        await ensureInitialized();
        // Also delete related votes and comments
        await database.execute('DELETE FROM company_poll_votes WHERE poll_id = ?', [id]);
        await database.execute('DELETE FROM company_poll_comments WHERE poll_id = ?', [id]);
        return await database.execute('DELETE FROM company_polls WHERE id = ?', [id]);
    }
};

// ==================== Company Poll Votes Service ====================

export const companyPollVoteService = {
    // Create a new vote
    create: async (voteData) => {
        await ensureInitialized();
        const { poll_id, user_id, vote, points } = voteData;
        const now = new Date().toISOString();
        const result = await database.insert(
            `INSERT INTO company_poll_votes (poll_id, user_id, vote, points, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [poll_id, user_id, vote || null, points || 0, now, now]
        );
        return { id: result.lastInsertRowid, ...voteData, created_at: now, updated_at: now };
    },

    // Get vote by ID
    getById: async (id) => {
        await ensureInitialized();
        return await database.queryOne('SELECT * FROM company_poll_votes WHERE id = ?', [id]);
    },

    // Get votes by poll ID
    getByPollId: async (pollId) => {
        await ensureInitialized();
        return await database.queryAll('SELECT * FROM company_poll_votes WHERE poll_id = ? ORDER BY created_at DESC', [pollId]);
    },

    // Get vote by poll ID and user ID
    getByPollAndUser: async (pollId, userId) => {
        await ensureInitialized();
        return await database.queryOne('SELECT * FROM company_poll_votes WHERE poll_id = ? AND user_id = ?', [pollId, userId]);
    },

    // Get all votes
    getAll: async () => {
        await ensureInitialized();
        return await database.queryAll('SELECT * FROM company_poll_votes ORDER BY created_at DESC');
    },

    // Update vote
    update: async (id, voteData) => {
        await ensureInitialized();
        const { vote, points } = voteData;
        const now = new Date().toISOString();
        await database.execute(
            `UPDATE company_poll_votes SET vote = ?, points = ?, updated_at = ? WHERE id = ?`,
            [vote || null, points || 0, now, id]
        );
        return await companyPollVoteService.getById(id);
    },

    // Delete vote
    delete: async (id) => {
        await ensureInitialized();
        return await database.execute('DELETE FROM company_poll_votes WHERE id = ?', [id]);
    },

    // Delete vote by poll and user
    deleteByPollAndUser: async (pollId, userId) => {
        await ensureInitialized();
        return await database.execute('DELETE FROM company_poll_votes WHERE poll_id = ? AND user_id = ?', [pollId, userId]);
    }
};

// ==================== Company Poll Comments Service ====================

export const companyPollCommentService = {
    // Create a new comment
    create: async (commentData) => {
        await ensureInitialized();
        const { poll_id, user_id, user_name, user_logo, parent_id, content } = commentData;
        const now = new Date().toISOString();
        const result = await database.insert(
            `INSERT INTO company_poll_comments (poll_id, user_id, user_name, user_logo, parent_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                poll_id,
                user_id,
                user_name || null,
                user_logo || null,
                parent_id || null,
                content || null,
                now,
                now
            ]
        );
        
        // Update comment count in poll
        const countResult = await database.queryOne('SELECT COUNT(*) as count FROM company_poll_comments WHERE poll_id = ?', [poll_id]);
        // Handle both SQLite (returns count as number) and PostgreSQL (returns count as string)
        const commentCount = typeof countResult?.count === 'string' ? parseInt(countResult.count) : (countResult?.count || 0);
        await database.execute('UPDATE company_polls SET comment_count = ?, updated_at = ? WHERE id = ?', [commentCount, now, poll_id]);

        return { id: result.lastInsertRowid, ...commentData, created_at: now, updated_at: now };
    },

    // Get comment by ID
    getById: async (id) => {
        await ensureInitialized();
        return await database.queryOne('SELECT * FROM company_poll_comments WHERE id = ?', [id]);
    },

    // Get comments by poll ID
    getByPollId: async (pollId, includeReplies = true) => {
        await ensureInitialized();
        if (includeReplies) {
            return await database.queryAll('SELECT * FROM company_poll_comments WHERE poll_id = ? ORDER BY created_at DESC', [pollId]);
        } else {
            return await database.queryAll('SELECT * FROM company_poll_comments WHERE poll_id = ? AND parent_id IS NULL ORDER BY created_at DESC', [pollId]);
        }
    },

    // Get replies to a comment
    getReplies: async (parentId) => {
        await ensureInitialized();
        return await database.queryAll('SELECT * FROM company_poll_comments WHERE parent_id = ? ORDER BY created_at ASC', [parentId]);
    },

    // Get all comments
    getAll: async () => {
        await ensureInitialized();
        return await database.queryAll('SELECT * FROM company_poll_comments ORDER BY created_at DESC');
    },

    // Update comment
    update: async (id, commentData) => {
        await ensureInitialized();
        const { content } = commentData;
        const now = new Date().toISOString();
        await database.execute(
            `UPDATE company_poll_comments SET content = ?, updated_at = ? WHERE id = ?`,
            [content || null, now, id]
        );
        return await companyPollCommentService.getById(id);
    },

    // Delete comment
    delete: async (id) => {
        await ensureInitialized();
        const comment = await companyPollCommentService.getById(id);
        if (!comment) return null;

        // Delete all replies first
        await database.execute('DELETE FROM company_poll_comments WHERE parent_id = ?', [id]);
        
        // Delete the comment
        const result = await database.execute('DELETE FROM company_poll_comments WHERE id = ?', [id]);

        // Update comment count in poll
        if (comment.poll_id) {
            const now = new Date().toISOString();
            const countResult = await database.queryOne('SELECT COUNT(*) as count FROM company_poll_comments WHERE poll_id = ?', [comment.poll_id]);
            // Handle both SQLite (returns count as number) and PostgreSQL (returns count as string)
            const commentCount = typeof countResult?.count === 'string' ? parseInt(countResult.count) : (countResult?.count || 0);
            await database.execute('UPDATE company_polls SET comment_count = ?, updated_at = ? WHERE id = ?', [commentCount, now, comment.poll_id]);
        }

        return result;
    }
};

// Export all services
export default {
    companyService,
    companyPollService,
    companyPollVoteService,
    companyPollCommentService
};

