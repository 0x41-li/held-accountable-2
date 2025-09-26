import { NextResponse } from 'next/server'
import { createViralDetection, generateViralDetectionUsingGPT, getEventsWithSocialScoreFromNewsAi, getViralDetections } from '@/services/polls/polls';

const getEventsData = async () => {
    const events = await getEventsWithSocialScoreFromNewsAi();
    return events;
}

const getTodayEvents = async () => {
    const today = (new Date(Date.now() - 24*60*60*1000)).toISOString().substring(0, 10);
    return await getViralDetections(today, today);
}

export async function GET(req) {
    let data = await getTodayEvents();
    if (data.length == 0) {
        const { events: { results } } = await getEventsData();
        const end = Math.min(5, results.length);
        for (const event of results.slice(0, end)) {
            console.log(event);
            const viral_detection = await generateViralDetectionUsingGPT(event);
            console.log(viral_detection);
            if (viral_detection) {
                data.push(await createViralDetection({
                    ...viral_detection,
                    post_date: (new Date(Date.now() - 24*60*60*1000)).toISOString().substring(0, 10)
                }));
            }
        }
    }

    return NextResponse.json({ message: 'Received', data }, { status: 200 });
}