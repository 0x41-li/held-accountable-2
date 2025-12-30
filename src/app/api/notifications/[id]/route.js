import { NextResponse } from 'next/server';
import { notificationService } from '@/services/database/companyService';

// PUT /api/notifications/[id] - Mark notification as read
export async function PUT(req, { params }) {
    try {
        const notificationId = parseInt(params.id);
        const body = await req.json();
        const { is_read } = body;

        if (is_read === false || is_read === 0) {
            // If we need to mark as unread in the future, we can handle it here
            return NextResponse.json(
                { error: 'Unread operation not implemented' },
                { status: 400 }
            );
        }

        const notification = await notificationService.markAsRead(notificationId);
        if (!notification) {
            return NextResponse.json(
                { error: 'Notification not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ notification }, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/notifications/[id]:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/notifications/[id] - Delete a notification
export async function DELETE(req, { params }) {
    try {
        const notificationId = parseInt(params.id);
        await notificationService.delete(notificationId);
        return NextResponse.json(
            { message: 'Notification deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in DELETE /api/notifications/[id]:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

