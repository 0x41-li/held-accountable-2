import { NextResponse } from 'next/server'
import { getCryptoSymbolPrices, getStockSymbolPrices } from '../../../../lib/trending'
import fs from 'fs';
import { getEventsFromNewsAi } from '@/services/polls/polls';

const getEventsData = async () => {
    const events = await getEventsFromNewsAi("dmoz/Computers/Artificial_Intelligence");
    return events;
}
export async function GET(req) {
    let data = [];
    if (fs.existsSync("upcoming_events")) {
        const dump = JSON.parse(fs.readFileSync("upcoming_events"));
        if (Date.now() - dump.last_timestamp > 3600 * 1000) {
            data = await getEventsData();
            fs.writeFileSync("upcoming_events", JSON.stringify({ last_timestamp: Date.now(), data }));
        } else {
            data = dump.data;
        }
        return NextResponse.json({ message: 'Received', data: data.events.results }, { status: 200 });
    }
    data = await getEventsData();
    fs.writeFileSync("upcoming_events", JSON.stringify({ last_timestamp: Date.now(), data }));
    return NextResponse.json({ message: 'Received', data: data.events.results }, { status: 200 });
}