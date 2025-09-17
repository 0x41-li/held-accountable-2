import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { addNewsArticle, createPoll, generatePoll, getExistingArticles, getHomePolls, getNewsFromNewsAi, getPollsByTopic, getUnusedNewsArticles, HOME_LATEST, updateNewsArticle } from '@/services/polls/polls'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'
export async function GET(req) {
    const short_topics = [
        "AI", 
        "Economics",
        "Travel",
        "Politics",
        "Crypto", 
    ]
    const topics = [
        "dmoz/Computers/Artificial_Intelligence", 
        "news/Business",
        "dmoz/Recreation/Travel",
        "news/Politics",
        "Cryptocurrency"
    ];
    const last_poll = await getHomePolls(HOME_LATEST, null, 1);
    let topicId = parseInt(Math.random() * 9999) % topics.length;
    if (last_poll) {
        if (last_poll.result.length > 0) {
            topicId = (short_topics.findIndex(tp => tp == last_poll.result[0].topic) + 1) % short_topics.length;
        }
    }
    
    const topic = topics[topicId];

    let { articles: { results } } = await getNewsFromNewsAi(topic);
    let article_url = "";
    
    for (const article of results) {
        if (article.date != (new Date()).toISOString().substring(0, 10))
            continue;


        const existingArticles = await getExistingArticles(article.url);

        if (existingArticles.length == 0) {
            let newArticle = { topic: short_topics[topicId], ...article};
            if (article_url.length == 0) {
                article_url = article.url;
                newArticle.used = true;
            }
            await addNewsArticle(newArticle);
            continue;
        }
        console.log(existingArticles.length, article.url, !existingArticles.find(article => article.used));

        if (!existingArticles.find(article => article.used) && article_url.length == 0) {
            article_url = article.url;
            for (const existArticle of existingArticles) {
                await updateNewsArticle(existArticle.id, { used: true });
            }
        }
    }

    let short_topic = short_topics[topicId];

    if (article_url.length == 0) {
        const articles = await getUnusedNewsArticles();
        if (articles.length == 0) {
            return "Failed";
        }

        article_url = articles[0].url;
        await updateNewsArticle(articles[0].id, { used: true });
    }
    
    const poll = await generatePoll(article_url) // random topic

    if (poll) {
        console.log('Poll generated successfully:', poll)
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
            }],

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
            ]
        });
        return NextResponse.json({ message: 'created', poll: createdPoll }, { status: 200 })
    }
    return NextResponse.json({ message: 'Received', poll }, { status: 200 })
}