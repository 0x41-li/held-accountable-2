import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createPoll, generatePoll, getPollsByTopic } from '@/services/polls/polls'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'
export async function GET(req) {
    const short_topics = [
        "AI", 
        "Health",
        "Economics",
        "Travel",
        "Politics",
        "Life Style",
        "Products",
        "Entertainment",
        "Crypto", 
    ]
    const topics = [
        "Artificial Intelligence", 
        "Health and Wellness",
        "Economic Outlook",
        "Travel, Hotels, and Navigation",
        "Iran/Israel crisis",
        "Food and Life style",
        "Products and Shopping",
        "Entertainment, Streaming, and Pop Culture",
        "Digital Assets & Crypto"
    ];
    const topicId = parseInt(Math.random() * 9999) % topics.length;
    const topic = topics[topicId];

    const topic_latest_polls = await getPollsByTopic(topic);
    const previous_headlines = topic_latest_polls.result.map(poll => poll.questions[0].headline);
    const poll = await generatePoll(topic, previous_headlines) // random topic

    if (poll) {
        console.log('Poll generated successfully:', poll)
        let dataWithSummary = { topic: short_topics[topicId], activeDate: {
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