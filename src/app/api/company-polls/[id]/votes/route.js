import { NextResponse } from 'next/server';
import { companyPollVoteService } from '@/services/database/companyService';

// GET /api/company-polls/[id]/votes - Get all votes for a poll
export async function GET(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const voteId = searchParams.get('vote_id');

        if (voteId) {
            // Get single vote by ID
            const vote = await companyPollVoteService.getById(parseInt(voteId));
            if (!vote || vote.poll_id !== pollId) {
                return NextResponse.json(
                    { error: 'Vote not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ vote }, { status: 200 });
        }

        if (userId) {
            // Get vote by poll and user
            const vote = await companyPollVoteService.getByPollAndUser(pollId, userId);
            return NextResponse.json({ vote }, { status: 200 });
        }

        // Get all votes for this poll
        const votes = await companyPollVoteService.getByPollId(pollId);
        return NextResponse.json({ votes }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/company-polls/[id]/votes:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/company-polls/[id]/votes - Create a new vote
export async function POST(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const body = await req.json();
        const { user_id, vote, points } = body;

        if (!user_id) {
            return NextResponse.json(
                { error: 'user_id is required' },
                { status: 400 }
            );
        }

        // Check if user already voted
        const existingVote = await companyPollVoteService.getByPollAndUser(pollId, user_id);
        if (existingVote) {
            return NextResponse.json(
                { error: 'User has already voted on this poll' },
                { status: 400 }
            );
        }

        const voteData = await companyPollVoteService.create({
            poll_id: pollId,
            user_id,
            vote,
            points
        });
        return NextResponse.json({ vote: voteData }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/company-polls/[id]/votes:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/company-polls/[id]/votes - Update a vote
export async function PUT(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const body = await req.json();
        const { vote_id, vote, points } = body;

        if (!vote_id) {
            return NextResponse.json(
                { error: 'vote_id is required' },
                { status: 400 }
            );
        }

        // Verify vote belongs to this poll
        const existingVote = await companyPollVoteService.getById(vote_id);
        if (!existingVote || existingVote.poll_id !== pollId) {
            return NextResponse.json(
                { error: 'Vote not found for this poll' },
                { status: 404 }
            );
        }

        const updatedVote = await companyPollVoteService.update(vote_id, { vote, points });
        return NextResponse.json({ vote: updatedVote }, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/company-polls/[id]/votes:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/company-polls/[id]/votes - Delete a vote
export async function DELETE(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const { searchParams } = new URL(req.url);
        const voteId = searchParams.get('vote_id');
        const userId = searchParams.get('user_id');

        if (voteId) {
            // Delete by vote ID
            const vote = await companyPollVoteService.getById(parseInt(voteId));
            if (!vote || vote.poll_id !== pollId) {
                return NextResponse.json(
                    { error: 'Vote not found for this poll' },
                    { status: 404 }
                );
            }
            await companyPollVoteService.delete(parseInt(voteId));
        } else if (userId) {
            // Delete by user ID
            await companyPollVoteService.deleteByPollAndUser(pollId, userId);
        } else {
            return NextResponse.json(
                { error: 'vote_id or user_id is required' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Vote deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in DELETE /api/company-polls/[id]/votes:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

