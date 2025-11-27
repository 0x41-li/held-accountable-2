import { NextResponse } from 'next/server'
import { clearTodayEvents, deletePoll, getPolls } from '@/services/polls/polls';
import { poll } from 'ethers/lib/utils';

export async function GET(req) {
    // await clearTodayEvents();
    const polls = await getPolls();
    console.log(poll.length);
    for (const poll of polls) {
        console.log(poll.id);
        await deletePoll(poll.id);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return NextResponse.json({ message: 'Received' }, { status: 200 });
}