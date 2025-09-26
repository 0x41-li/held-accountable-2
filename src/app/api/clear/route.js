import { NextResponse } from 'next/server'
import { clearTodayEvents } from '@/services/polls/polls';

export async function GET(req) {
    await clearTodayEvents();
    return NextResponse.json({ message: 'Received' }, { status: 200 });
}