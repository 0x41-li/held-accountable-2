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

    // Notifications table
    await database.createTable(`
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            title VARCHAR(255),
            content TEXT,
            poll_id INTEGER,
            points INTEGER,
            is_read INTEGER DEFAULT 0,
            created_at VARCHAR(50),
            updated_at VARCHAR(50),
            FOREIGN KEY (poll_id) REFERENCES company_polls(id)
        )
    `);

    // Point history table
    await database.createTable(`
        CREATE TABLE IF NOT EXISTS point_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            points INTEGER NOT NULL,
            description TEXT,
            poll_id INTEGER,
            created_at VARCHAR(50),
            FOREIGN KEY (poll_id) REFERENCES company_polls(id)
        )
    `);

    // User ACC tokens table (to track ACC token balance)
    await database.createTable(`
        CREATE TABLE IF NOT EXISTS user_acc_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id VARCHAR(255) NOT NULL UNIQUE,
            acc_balance INTEGER DEFAULT 0,
            created_at VARCHAR(50),
            updated_at VARCHAR(50)
        )
    `);

    // Article read progress table (to track which sections user has viewed)
    await database.createTable(`
        CREATE TABLE IF NOT EXISTS article_read_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id VARCHAR(255) NOT NULL,
            poll_id INTEGER NOT NULL,
            section_id VARCHAR(255) NOT NULL,
            viewed_at VARCHAR(50),
            UNIQUE(user_id, poll_id, section_id),
            FOREIGN KEY (poll_id) REFERENCES company_polls(id)
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
    },

    // Get votes by user ID (with poll information for accuracy calculation)
    getByUserId: async (userId) => {
        await ensureInitialized();
        return await database.queryAll(
            `SELECT v.*, p.vote_result 
             FROM company_poll_votes v 
             LEFT JOIN company_polls p ON v.poll_id = p.id 
             WHERE v.user_id = ? 
             ORDER BY v.created_at DESC`,
            [userId]
        );
    },

    // Get user statistics (counts and sums)
    getUserStatistics: async (userId) => {
        await ensureInitialized();
        
        // Get total votes count for user
        const votesCount = await database.queryOne(
            'SELECT COUNT(*) as count FROM company_poll_votes WHERE user_id = ?',
            [userId]
        );
        const totalVotes = typeof votesCount?.count === 'string' ? parseInt(votesCount.count) : (votesCount?.count || 0);

        // Get total points sum for user
        const pointsResult = await database.queryOne(
            'SELECT COALESCE(SUM(points), 0) as total FROM company_poll_votes WHERE user_id = ?',
            [userId]
        );
        const totalPoints = typeof pointsResult?.total === 'string' ? parseInt(pointsResult.total) : (pointsResult?.total || 0);

        // Calculate vote accuracy: count votes where user's vote matches poll's vote_result
        // vote: 0 or NULL = bullish, 1 = bearish
        // vote_result: 0 = bullish wins, 1 = bearish wins, NULL/-1 = not calculated yet
        const correctVotesResult = await database.queryOne(
            `SELECT COUNT(*) as count 
             FROM company_poll_votes v 
             INNER JOIN company_polls p ON v.poll_id = p.id 
             WHERE v.user_id = ? 
             AND p.vote_result IS NOT NULL 
             AND p.vote_result != -1
             AND (
                 (p.vote_result = 0 AND (v.vote = 0 OR v.vote IS NULL)) OR
                 (p.vote_result = 1 AND v.vote = 1)
             )`,
            [userId]
        );
        const correctVotes = typeof correctVotesResult?.count === 'string' 
            ? parseInt(correctVotesResult.count) 
            : (correctVotesResult?.count || 0);
        
        const voteAccuracy = totalVotes > 0 ? Math.round((correctVotes / totalVotes) * 100) : 0;

        return {
            total_votes: totalVotes,
            total_points: totalPoints,
            vote_accuracy: voteAccuracy,
            correct_votes: correctVotes
        };
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

    // Get comments count by user ID
    getCountByUserId: async (userId) => {
        await ensureInitialized();
        const result = await database.queryOne(
            'SELECT COUNT(*) as count FROM company_poll_comments WHERE user_id = ?',
            [userId]
        );
        return typeof result?.count === 'string' ? parseInt(result.count) : (result?.count || 0);
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

// ==================== Notifications Service ====================

export const notificationService = {
    // Create a new notification
    create: async (notificationData) => {
        await ensureInitialized();
        const { user_id, type, title, content, poll_id, points } = notificationData;
        const now = new Date().toISOString();
        const result = await database.insert(
            `INSERT INTO notifications (user_id, type, title, content, poll_id, points, is_read, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                type,
                title || null,
                content || null,
                poll_id || null,
                points || null,
                0, // is_read = false
                now,
                now
            ]
        );
        return { id: result.lastInsertRowid, ...notificationData, is_read: 0, created_at: now, updated_at: now };
    },

    // Get notification by ID
    getById: async (id) => {
        await ensureInitialized();
        return await database.queryOne('SELECT * FROM notifications WHERE id = ?', [id]);
    },

    // Get notifications by user ID
    getByUserId: async (userId, filters = {}) => {
        await ensureInitialized();
        let query = 'SELECT * FROM notifications WHERE user_id = ?';
        const params = [userId];

        if (filters.is_read !== undefined) {
            query += ' AND is_read = ?';
            params.push(filters.is_read ? 1 : 0);
        }

        if (filters.type) {
            query += ' AND type = ?';
            params.push(filters.type);
        }

        query += ' ORDER BY created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
            if (filters.offset) {
                query += ' OFFSET ?';
                params.push(filters.offset);
            }
        }

        return await database.queryAll(query, params);
    },

    // Get unread count for a user
    getUnreadCount: async (userId) => {
        await ensureInitialized();
        const result = await database.queryOne(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
            [userId]
        );
        const count = typeof result?.count === 'string' ? parseInt(result.count) : (result?.count || 0);
        return count;
    },

    // Mark notification as read
    markAsRead: async (id) => {
        await ensureInitialized();
        const now = new Date().toISOString();
        await database.execute(
            'UPDATE notifications SET is_read = 1, updated_at = ? WHERE id = ?',
            [now, id]
        );
        return await notificationService.getById(id);
    },

    // Mark all notifications as read for a user
    markAllAsRead: async (userId) => {
        await ensureInitialized();
        const now = new Date().toISOString();
        await database.execute(
            'UPDATE notifications SET is_read = 1, updated_at = ? WHERE user_id = ? AND is_read = 0',
            [now, userId]
        );
        return true;
    },

    // Delete notification
    delete: async (id) => {
        await ensureInitialized();
        return await database.execute('DELETE FROM notifications WHERE id = ?', [id]);
    },

    // Delete all notifications for a user
    deleteAllByUserId: async (userId) => {
        await ensureInitialized();
        return await database.execute('DELETE FROM notifications WHERE user_id = ?', [userId]);
    }
};

// ==================== Point History Service ====================

export const pointHistoryService = {
    // Create a new point history entry
    create: async (historyData) => {
        await ensureInitialized();
        const { user_id, type, points, description, poll_id } = historyData;
        const now = new Date().toISOString();
        const result = await database.insert(
            `INSERT INTO point_history (user_id, type, points, description, poll_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, type, points, description || null, poll_id || null, now]
        );
        return { id: result.lastInsertRowid, ...historyData, created_at: now };
    },

    // Get point history by user ID
    getByUserId: async (userId, limit = 100) => {
        await ensureInitialized();
        return await database.queryAll(
            'SELECT * FROM point_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
            [userId, limit]
        );
    },

    // Get all point history
    getAll: async () => {
        await ensureInitialized();
        return await database.queryAll('SELECT * FROM point_history ORDER BY created_at DESC');
    }
};

// ==================== User ACC Tokens Service ====================

export const userAccTokenService = {
    // Get or create user ACC token record
    getOrCreate: async (userId) => {
        await ensureInitialized();
        let userToken = await database.queryOne('SELECT * FROM user_acc_tokens WHERE user_id = ?', [userId]);
        if (!userToken) {
            const now = new Date().toISOString();
            const result = await database.insert(
                'INSERT INTO user_acc_tokens (user_id, acc_balance, created_at, updated_at) VALUES (?, ?, ?, ?)',
                [userId, 0, now, now]
            );
            return { id: result.lastInsertRowid, user_id: userId, acc_balance: 0, created_at: now, updated_at: now };
        }
        return userToken;
    },

    // Get user ACC balance
    getBalance: async (userId) => {
        await ensureInitialized();
        const userToken = await userAccTokenService.getOrCreate(userId);
        return userToken.acc_balance || 0;
    },

    // Update user ACC balance
    updateBalance: async (userId, newBalance) => {
        await ensureInitialized();
        const now = new Date().toISOString();
        // First try to update, if no rows affected, insert
        await database.execute(
            `UPDATE user_acc_tokens SET acc_balance = ?, updated_at = ? WHERE user_id = ?`,
            [newBalance, now, userId]
        );
        // If update didn't affect any rows, insert new record
        const existing = await database.queryOne('SELECT * FROM user_acc_tokens WHERE user_id = ?', [userId]);
        if (!existing) {
            await database.insert(
                'INSERT INTO user_acc_tokens (user_id, acc_balance, created_at, updated_at) VALUES (?, ?, ?, ?)',
                [userId, newBalance, now, now]
            );
        }
        return await userAccTokenService.getOrCreate(userId);
    },

    // Add ACC tokens to user balance
    addTokens: async (userId, amount) => {
        await ensureInitialized();
        const currentBalance = await userAccTokenService.getBalance(userId);
        const newBalance = currentBalance + amount;
        return await userAccTokenService.updateBalance(userId, newBalance);
    }
};

// ==================== Article Read Progress Service ====================

export const articleReadProgressService = {
    // Mark a section as viewed
    markSectionAsViewed: async (userId, pollId, sectionId) => {
        await ensureInitialized();
        const now = new Date().toISOString();
        try {
            const result = await database.insert(
                `INSERT OR IGNORE INTO article_read_progress (user_id, poll_id, section_id, viewed_at) VALUES (?, ?, ?, ?)`,
                [userId, pollId, sectionId, now]
            );
            return { id: result.lastInsertRowid || null, user_id: userId, poll_id: pollId, section_id: sectionId, viewed_at: now };
        } catch (error) {
            // If insert fails due to unique constraint, try to update
            await database.execute(
                `UPDATE article_read_progress SET viewed_at = ? WHERE user_id = ? AND poll_id = ? AND section_id = ?`,
                [now, userId, pollId, sectionId]
            );
            return await articleReadProgressService.getViewedSections(userId, pollId);
        }
    },

    // Get all viewed sections for a user and poll
    getViewedSections: async (userId, pollId) => {
        await ensureInitialized();
        return await database.queryAll(
            'SELECT section_id FROM article_read_progress WHERE user_id = ? AND poll_id = ?',
            [userId, pollId]
        );
    },

    // Get read progress percentage for a user and poll
    getReadProgress: async (userId, pollId, totalSections) => {
        await ensureInitialized();
        if (!totalSections || totalSections === 0) return 0;
        const viewedSections = await articleReadProgressService.getViewedSections(userId, pollId);
        const viewedCount = viewedSections.length;
        return Math.round((viewedCount / totalSections) * 100);
    }
};

// Export all services
export default {
    companyService,
    companyPollService,
    companyPollVoteService,
    companyPollCommentService,
    notificationService,
    pointHistoryService,
    userAccTokenService,
    articleReadProgressService
};

