import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createPoll, generatePoll, getHomePolls, getNewsFromNewsAi, HOME_LATEST } from '@/services/polls/polls'
import db from '../../../../lib/sqlite'

function deleteOldNewsArticles() {
    return db.prepare("DELETE FROM news_articles WHERE date < ?").run((new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10));
}

function getExistingArticles(url, title) {
    return db.prepare("SELECT * FROM news_articles WHERE url = ? OR title = ?").get(url, title) ?? []
}

function addNewsArticle(article) {
    return db.prepare("INSERT INTO news_articles (title, url, date, body) VALUES (?, ?, ?, ?)").run(article.title, article.url, article.date, article.body)
}

function updateNewsArticle(url, updates) {
    const setClause = Object.keys(updates)
        .map(key => `${key} = ?`)
        .join(", ");
    const values = Object.values(updates);
    return db.prepare(`UPDATE news_articles SET ${setClause} WHERE url = ?`).run(...values, url);
}

function getUnusedNewsArticles() {
    return db.prepare("SELECT * FROM news_articles WHERE used IS NULL AND date = ?").all((new Date()).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10));
}

export async function GET(req) {
    try {
        deleteOldNewsArticles();
        const short_topics = [
            "AI", 
            "Finance",
            "Politics",
            "Crypto", 
        ]

        const topics = [
            "{\"categoryUri\":\"dmoz/Computers/Artificial_Intelligence\"}", 
            "{\"conceptUri\":\"http://en.wikipedia.org/wiki/Finance\"}",
            "{\"categoryUri\":\"news/Politics\"}",
            "{\"conceptUri\":\"http://en.wikipedia.org/wiki/Blockchain\"}"
        ];

        const last_poll = await getHomePolls(HOME_LATEST, null, 1);
        let topicId = parseInt(Math.random() * 9999) % topics.length;
        if (last_poll) {
            if (last_poll.result.length > 0) {
                topicId = (short_topics.findIndex(tp => tp == last_poll.result[0].topic) + 1) % short_topics.length;
            }
        }
        
        let topic = topics[topicId];

        let results = [];

        let article_url = "";
        let article_title = "";
        let article_body = "";
        let iteration = 0;

        while (iteration < topics.length && article_url.length == 0) {
            iteration ++;
            let { articles: { results: res_data } } = await getNewsFromNewsAi(topic);
            results = res_data;
            if (results.length == 0) {
                topicId = (topicId + 1) % topics.length;
                topic = topics[topicId];
                continue;
            }

            for (const article of results) {
                if (article.date != (new Date()).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10))
                    continue;

                const existingArticles = getExistingArticles(article.url, article.title);

                if (existingArticles.length == 0) {
                    let newArticle = { topic: short_topics[topicId], ...article };
                    if (article_url.length == 0) {
                        article_url = article.url;
                        article_title = article.title;
                        article_body = article.body;
                    }
                    addNewsArticle(newArticle);
                    continue;
                }
            }

            if (article_url.length == 0) {
                const articles = getUnusedNewsArticles();
                if (articles.length == 0) {
                    topicId = (topicId + 1) % topics.length;
                    topic = topics[topicId];
                    continue;
                }

                article_url = articles[0].url;
                article_title = articles[0].title;
                article_body = articles[0].body;
            }
        }

        console.log("Generate poll for this url: ", article_url);

        const poll = await generatePoll(article_url, article_title, article_body) // random topic

        if (poll) {
            updateNewsArticle(article_url, { used: 1 });
            let dataWithSummary = { topic: poll.category, activeDate: {
                    from: "2025-01-01",
                    to: "2025-01-01",
                },
                totalVotes: 0,
                questions: [{
                    headline: poll.headline,
                    question: poll.question,
                    options: poll.options.map(option => ({text:option, votes:0})),
                    summary: poll.wiki_summary,
                    totalVotes: 0,
                }]
            };

            // return;
            const createdPoll = await createPoll({
                ...dataWithSummary,
                status: 1,
                user: {
                    id: "",
                    fullname: "",
                    username: "",
                    avatar: "https://held-accountable.vercel.app/images/logo.png"
                },
                golden_insights: [
                    {
                        title: poll.blog_title,
                        content: poll.blog_content
                    }
                ],
                article_url
            });
            return NextResponse.json({ message: 'created', poll: createdPoll }, { status: 200 })
        }
        return NextResponse.json({ message: 'Received', poll }, { status: 200 })
    }
    catch (e) {
        return NextResponse.json({ message: 'Error', error: e.message }, { status: 500 })
    }
}