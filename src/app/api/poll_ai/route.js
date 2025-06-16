import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createPoll, generatePoll } from '@/services/polls/polls'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'
export async function GET(req) {
    const topics = ["Digital Assets & Crypto", "Artificial Intelligence", "Aviation"];
    const topic = topics[parseInt(Math.random() * 9999) % topics.length];
    const poll = await generatePoll(topic) // random topic
    if (poll) {
        console.log('Poll generated successfully:', poll)
        const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", "ahura0901@gmail.com")));
        if (userDoc.empty) {
            return;
        }

        let dataWithSummary = { topic: topic, activeDate: {
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