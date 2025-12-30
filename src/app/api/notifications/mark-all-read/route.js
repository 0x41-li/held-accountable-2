import { NextResponse } from 'next/server';
import { notificationService } from '@/services/database/companyService';

// POST /api/notifications/mark-all-read - Mark all notifications as read for a user
export async function POST(req) {
    try {
        const body = await req.json();
        const { user_id } = body;

        if (!user_id) {
            return NextResponse.json(
                { error: 'user_id is required' },
                { status: 400 }
            );
        }

        await notificationService.markAllAsRead(user_id);
        return NextResponse.json(
            { message: 'All notifications marked as read' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in POST /api/notifications/mark-all-read:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

