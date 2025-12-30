import { NextResponse } from 'next/server';
import { articleReadProgressService, companyPollService } from '@/services/database/companyService';

// GET /api/polls/[id]/read-progress - Get read progress for a poll
export async function GET(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json(
                { error: 'user_id is required' },
                { status: 400 }
            );
        }

        // Get poll to determine total sections
        const poll = await companyPollService.getById(pollId);
        if (!poll) {
            return NextResponse.json(
                { error: 'Poll not found' },
                { status: 404 }
            );
        }

        // Parse section_ids to get total count
        let sectionIds = [];
        try {
            if (poll.section_ids) {
                sectionIds = typeof poll.section_ids === 'string' 
                    ? JSON.parse(poll.section_ids) 
                    : poll.section_ids;
            }
        } catch (e) {
            console.warn('Error parsing section_ids:', e);
        }

        const totalSections = sectionIds.length || 0;
        const progress = await articleReadProgressService.getReadProgress(userId, pollId, totalSections);

        return NextResponse.json({
            progress,
            total_sections: totalSections,
            viewed_sections: (await articleReadProgressService.getViewedSections(userId, pollId)).length
        }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/polls/[id]/read-progress:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

