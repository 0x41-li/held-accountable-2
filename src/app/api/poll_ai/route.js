import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createPoll, generatePoll } from '@/services/polls/polls'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'
export async function GET(req) {
    const topics = ["Digital Assets & Crypto", "Artificial Intelligence", "Aviation"];
    const poll = await generatePoll(topics[parseInt(Math.random() * 9999) % topics.length]) // random topic
    if (poll) {
        console.log('Poll generated successfully:', poll)
        const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", "ahura0901@gmail.com")));
        if (userDoc.empty) {
            return;
        }

        let dataWithSummary = { topic: "Digital Assets & Crypto", activeDate: {
                from: "2025-01-01",
                to: "2025-01-01",
            },
            totalVotes: 0,
            questions: [{
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
                id: userDoc.docs[0].id,
                fullname: userDoc.docs[0].data().fullname,
                username: userDoc.docs[0].data().username,
                avatar: userDoc.docs[0].data().avatar ?? "" 
            }
        });
        return NextResponse.json({ message: 'created', poll: createdPoll }, { status: 200 })
    }
    
    return NextResponse.json({ message: 'Received', poll }, { status: 200 })
}