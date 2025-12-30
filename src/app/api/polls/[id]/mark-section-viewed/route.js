import { NextResponse } from 'next/server';
import { articleReadProgressService } from '@/services/database/companyService';

// POST /api/polls/[id]/mark-section-viewed - Mark a section as viewed
export async function POST(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const { user_id, section_id } = await req.json();

        if (!user_id || !section_id) {
            return NextResponse.json(
                { error: 'user_id and section_id are required' },
                { status: 400 }
            );
        }

        await articleReadProgressService.markSectionAsViewed(user_id, pollId, section_id);

        return NextResponse.json({
            success: true
        }, { status: 200 });
    } catch (error) {
        console.error('Error in POST /api/polls/[id]/mark-section-viewed:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

