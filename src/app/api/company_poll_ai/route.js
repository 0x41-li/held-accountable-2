import { NextResponse } from 'next/server'
import { generatePoll, getBusinessNewsForCompaniesFromNewsAi, getUserById, updateUserById } from '@/services/polls/polls'
import db from '../../../../lib/sqlite'
import { companyPollService, companyService, companyPollVoteService } from '@/services/database/companyService';

function deleteOldNewsArticles() {
    return db.prepare("DELETE FROM business_news_articles WHERE date < ?").run((new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10));
}

function getExistingArticles(url, title) {
    const result = db.prepare("SELECT * FROM business_news_articles WHERE url = ? OR title = ?").get(url, title);
    return result || null;
}

function addNewsArticle(article) {
    return db.prepare("INSERT INTO business_news_articles (title, url, date, body, image_url) VALUES (?, ?, ?, ?, ?)").run(article.title, article.url, article.date, article.body, article.image)
}

function updateNewsArticle(url, updates) {
    const setClause = Object.keys(updates)
        .map(key => `${key} = ?`)
        .join(", ");
    const values = Object.values(updates);
    return db.prepare(`UPDATE business_news_articles SET ${setClause} WHERE url = ?`).run(...values, url);
}

function getUnusedNewsArticles() {
    return db.prepare("SELECT * FROM business_news_articles WHERE used IS NULL ORDER BY date DESC").all();
}

/**
 * Process polls that have passed 24 hours from creation
 * Calculate vote results and update polls
 */
async function processExpiredPolls() {
    try {
        // Get current time minus 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        // Find all polls that:
        // 1. Were created more than 24 hours ago
        // 2. Have vote_result = 0 or NULL (not yet calculated)
        const expiredPolls = await companyPollService.getAll(
            { status: 1 }, // Only active polls
            { limit: 1000 } // Get a reasonable batch
        );
        
        // Filter polls that are older than 24 hours and don't have a result yet
        // vote_result: null/undefined/-1 = not calculated, 0 = bullish wins, 1 = bearish wins
        const pollsToProcess = expiredPolls.filter(poll => {
            const createdAt = new Date(poll.created_at);
            const isExpired = createdAt.getTime() < (Date.now() - 24 * 60 * 60 * 1000);
            // Only process polls that haven't been calculated yet (null, undefined, or -1)
            const needsResult = poll.vote_result === null || poll.vote_result === undefined || poll.vote_result === -1;
            return isExpired && needsResult;
        });
        
        console.log(`Found ${pollsToProcess.length} expired polls to process`);
        
        // Process each poll
        for (const poll of pollsToProcess) {
            try {
                // Get all votes for this poll
                const votes = await companyPollVoteService.getByPollId(poll.id);
                
                // Count votes (vote: 0 = bullish, 1 = bearish, null = bullish by default)
                const bullish = votes.filter(v => v.vote === 0 || v.vote === null).length;
                const bearish = votes.filter(v => v.vote === 1).length;
                
                // Determine winner (bigger count wins)
                let voteResult = null;
                if (bullish > bearish) {
                    voteResult = 0; // Bullish wins
                } else if (bearish > bullish) {
                    voteResult = 1; // Bearish wins
                } else if (bullish === bearish && bullish > 0) {
                    // Tie - default to bullish (0)
                    voteResult = 0;
                } else {
                    // No votes - keep as 0 (default)
                    voteResult = 0;
                }
                
                // Update poll with vote result
                await companyPollService.update(poll.id, { vote_result: voteResult });
                
                // Award points to users who voted correctly
                // Points per correct vote (can be adjusted)
                const POINTS_PER_CORRECT_VOTE = 1;
                
                // Find all votes that match the winning side
                const winningVotes = votes.filter(vote => {
                    // vote: 0 or null = bullish, 1 = bearish
                    if (voteResult === 0) {
                        // Bullish wins - award points to bullish votes (0 or null)
                        return vote.vote === 0 || vote.vote === null;
                    } else {
                        // Bearish wins - award points to bearish votes (1)
                        return vote.vote === 1;
                    }
                });
                
                // Update points for each winning vote and user's total points in Firebase
                let pointsAwarded = 0;
                for (const vote of winningVotes) {
                    try {
                        // Update vote points in database
                        const currentPoints = vote.points || 0;
                        const newPoints = currentPoints + POINTS_PER_CORRECT_VOTE;
                        await companyPollVoteService.update(vote.id, { 
                            vote: vote.vote,
                            points: newPoints 
                        });
                        
                        // Update user's total points in Firebase
                        if (vote.user_id) {
                            try {
                                const user = await getUserById(vote.user_id);
                                if (user) {
                                    const currentUserPoints = user.points || 0;
                                    const newUserPoints = currentUserPoints + POINTS_PER_CORRECT_VOTE;
                                    await updateUserById(vote.user_id, { 
                                        points: newUserPoints 
                                    });
                                }
                            } catch (firebaseError) {
                                console.error(`Error updating Firebase points for user ${vote.user_id}:`, firebaseError);
                                // Continue processing other votes even if one fails
                            }
                        }
                        
                        pointsAwarded++;
                    } catch (error) {
                        console.error(`Error updating points for vote ${vote.id}:`, error);
                    }
                }
                
                console.log(`Updated poll ${poll.id}: ${voteResult === 0 ? 'Bullish' : 'Bearish'} wins (${bullish} vs ${bearish}). Awarded ${POINTS_PER_CORRECT_VOTE} point(s) to ${pointsAwarded} correct voters.`);
            } catch (error) {
                console.error(`Error processing poll ${poll.id}:`, error);
            }
        }
        
        return { processed: pollsToProcess.length };
    } catch (error) {
        console.error('Error processing expired polls:', error);
        return { processed: 0, error: error.message };
    }
}

export async function GET(req) {
    try {
        // First, process expired polls and calculate vote results
        await processExpiredPolls();
        
        deleteOldNewsArticles();

        const today = (new Date()).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
        let article_url = "";
        let article_title = "";
        let article_body = "";
        let article_image = "";

        try {
            const newsResponse = await getBusinessNewsForCompaniesFromNewsAi();
            if (!newsResponse?.articles?.results) {
                // If API call failed, try unused articles
                const unusedArticles = getUnusedNewsArticles();
                if (unusedArticles.length > 0) {
                    article_url = unusedArticles[0].url;
                    article_title = unusedArticles[0].title;
                    article_body = unusedArticles[0].body;
                    article_image = unusedArticles[0].image_url;
                }
            } else {
                const results = newsResponse.articles.results;
                
                // Process articles from today
                for (const article of results) {
                    // Only process articles from today
                    if (article.date !== today) {
                        continue;
                    }

                    // Check if article already exists
                    const existingArticle = getExistingArticles(article.url, article.title);
                    
                    if (!existingArticle) {
                        // New article - save it
                        const newArticle = { ...article };
                        addNewsArticle(newArticle);
                        
                        // Use this article if we haven't selected one yet
                        if (!article_url) {
                            article_url = article.url;
                            article_title = article.title;
                            article_body = article.body;
                            article_image = article.image;
                        }
                    }
                }

                // If no new article found, try unused articles
                if (!article_url) {
                    const unusedArticles = getUnusedNewsArticles();
                    if (unusedArticles.length > 0) {
                        article_url = unusedArticles[0].url;
                        article_title = unusedArticles[0].title;
                        article_body = unusedArticles[0].body;
                        article_image = unusedArticles[0].image_url;
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching business news:', error);
            // Try unused articles as fallback
            const unusedArticles = getUnusedNewsArticles();
            if (unusedArticles.length > 0) {
                article_url = unusedArticles[0].url;
                article_title = unusedArticles[0].title;
                article_body = unusedArticles[0].body;
                article_image = unusedArticles[0].image_url;
            }
        }

        // Validate we have an article before proceeding
        if (!article_url) {
            return NextResponse.json({ 
                message: 'No articles available', 
                error: 'Could not find any new or unused articles to generate a poll from' 
            }, { status: 404 });
        }

        console.log("Generate poll for this url: ", article_url);

        const poll = await generatePoll(article_url, article_title, article_body, article_image);

        if (!poll) {
            return NextResponse.json({ 
                message: 'Failed to generate poll', 
                error: 'Poll generation returned no result' 
            }, { status: 500 });
        }

        console.log('poll', poll);

        // Mark article as used
        updateNewsArticle(article_url, { used: 1 });

        // check if company exists
        let company = await companyService.getByUrl(poll.company);
        if (!company) {
            // create company
            company = await companyService.create({
                name: poll.company_name,
                url: poll.company,
                logo: ""
            });
        }
        
        const dataWithSummary = { 
            category: poll.category, 
            title: poll.title,
            content: poll.content,
            image_url: article_image,
            section_ids: JSON.stringify(poll.sections_ids),
            section_titles: JSON.stringify(poll.sections_titles),
            company: company.id,
            status: 1,
            vote_result: -1, // -1 means not calculated yet, will be set to 0 (bullish) or 1 (bearish) after 24 hours
            comment_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            url: article_url
        };

        console.log('dataWithSummary', dataWithSummary);

        const createdPoll = await companyPollService.create(dataWithSummary);
        return NextResponse.json({ message: 'created', poll: createdPoll }, { status: 200 });
    }
    catch (e) {
        return NextResponse.json({ message: 'Error', error: e.message }, { status: 500 })
    }
}