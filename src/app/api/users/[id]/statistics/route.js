import { NextResponse } from 'next/server';
import { companyPollVoteService, companyPollCommentService } from '@/services/database/companyService';

// GET /api/users/[id]/statistics - Get user statistics
export async function GET(req, { params }) {
    try {
        const userId = params.id;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get user statistics using optimized SQL queries with JOINs
        const voteStats = await companyPollVoteService.getUserStatistics(userId);
        const totalComments = await companyPollCommentService.getCountByUserId(userId);

        return NextResponse.json({
            statistics: {
                vote_accuracy: voteStats.vote_accuracy,
                total_votes: voteStats.total_votes,
                total_comments: totalComments,
                total_points: voteStats.total_points
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/users/[id]/statistics:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

