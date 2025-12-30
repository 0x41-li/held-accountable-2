import { NextResponse } from 'next/server';
import { notificationService } from '@/services/database/companyService';

// GET /api/notifications - Get all notifications for the current user
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const isRead = searchParams.get('is_read');
        const type = searchParams.get('type');
        const limit = searchParams.get('limit');
        const offset = searchParams.get('offset');

        if (!userId) {
            return NextResponse.json(
                { error: 'user_id is required' },
                { status: 400 }
            );
        }

        const filters = {};
        if (isRead !== null && isRead !== undefined) {
            filters.is_read = isRead === 'true' || isRead === '1';
        }
        if (type) {
            filters.type = type;
        }
        if (limit) {
            filters.limit = parseInt(limit);
            if (offset) {
                filters.offset = parseInt(offset);
            }
        }

        const notifications = await notificationService.getByUserId(userId, filters);
        const unreadCount = await notificationService.getUnreadCount(userId);

        return NextResponse.json({ 
            notifications, 
            unread_count: unreadCount 
        }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/notifications:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/notifications - Create a new notification
export async function POST(req) {
    try {
        const body = await req.json();
        const { user_id, type, title, content, poll_id, points } = body;

        if (!user_id || !type) {
            return NextResponse.json(
                { error: 'user_id and type are required' },
                { status: 400 }
            );
        }

        const notification = await notificationService.create({
            user_id,
            type,
            title,
            content,
            poll_id,
            points
        });

        return NextResponse.json({ notification }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/notifications:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

