import { NextResponse } from 'next/server'
import { createSnapshot, createViralDetection, deleteViralDetection, generateViralDetectionUsingGPT, getEventsWithSocialScoreFromNewsAi, getViralDetections } from '@/services/polls/polls';

const getEventsData = async () => {
    const topics = [
        "{\"categoryUri\":\"dmoz/Computers/Artificial_Intelligence\"}", 
        "{\"conceptUri\":\"http://en.wikipedia.org/wiki/Finance\"}",
        "{\"categoryUri\":\"news/Politics\"}",
        "{\"conceptUri\":\"http://en.wikipedia.org/wiki/Blockchain\"}"
    ];

    let results = [], topic_id = 0;

    while (results.length < 5) {
        const {events: {results: events}} = await getEventsWithSocialScoreFromNewsAi(topics[topic_id]);
        if (events.length > 0) {
            const data = events.filter(ev => !results.some(ev1 => ev.uri == ev1.uri));
            if (data.length > 0) {
                results.push(data[0]);
            }
        }
        topic_id = (topic_id + 1) % topics.length;
    }
    return results;
}

const getTodayEvents = async () => {
    const today = (new Date(Date.now() - 24*60*60*1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
    return await getViralDetections(today, today);
}

const movePreviousEventToSnapshots = async () => {
    // Implementation for moving previous events to snapshots
    const endDate = (new Date(Date.now() - 2*24*60*60*1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
    const previousEvents = await getViralDetections(null, endDate);
    for (const event of previousEvents) {
        await createSnapshot({
            title: event.title,
            content: event.content,
            post_date: event.post_date,
            tags: [event.category]
        });
        await deleteViralDetection(event.id);
    }
}

export async function GET(req) {
    await movePreviousEventToSnapshots();
    let data = await getTodayEvents();
    if (data.length == 0) {
        const results = await getEventsData();
        const end = Math.min(5, results.length);
        for (const event of results.slice(0, end)) {
            const viral_detection = await generateViralDetectionUsingGPT(event);
            if (viral_detection) {
                data.push(await createViralDetection({
                    ...viral_detection,
                    post_date: (new Date(Date.now() - 24*60*60*1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10)
                }));
            }
        }
    }

    return NextResponse.json({ message: 'Received', data }, { status: 200 });
}