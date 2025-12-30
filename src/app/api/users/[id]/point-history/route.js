import { NextResponse } from 'next/server';
import { pointHistoryService } from '@/services/database/companyService';

// GET /api/users/[id]/point-history - Get point history for user
export async function GET(req, { params }) {
    try {
        const userId = params.id;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 100;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const history = await pointHistoryService.getByUserId(userId, limit);

        return NextResponse.json({
            history
        }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/users/[id]/point-history:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

