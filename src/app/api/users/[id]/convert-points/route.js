import { NextResponse } from 'next/server';
import { companyPollVoteService, pointHistoryService, userAccTokenService } from '@/services/database/companyService';

const CONVERSION_RATE = 100; // 100 points = 1 ACC token

// POST /api/users/[id]/convert-points - Convert points to ACC tokens
export async function POST(req, { params }) {
    try {
        const userId = params.id;
        const { convertAll, points } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get user's available points
        const voteStats = await companyPollVoteService.getUserStatistics(userId);
        const availablePoints = voteStats.total_points;

        if (availablePoints <= 0) {
            return NextResponse.json(
                { error: 'No points available to convert' },
                { status: 400 }
            );
        }

        // Determine how many points to convert
        let pointsToConvert = 0;
        if (convertAll) {
            pointsToConvert = availablePoints;
        } else if (points && points > 0) {
            if (points > availablePoints) {
                return NextResponse.json(
                    { error: 'Not enough points available' },
                    { status: 400 }
                );
            }
            pointsToConvert = points;
        } else {
            return NextResponse.json(
                { error: 'Please specify points to convert or set convertAll to true' },
                { status: 400 }
            );
        }

        // Calculate ACC tokens to award
        const accTokens = Math.floor(pointsToConvert / CONVERSION_RATE);
        if (accTokens <= 0) {
            return NextResponse.json(
                { error: `Minimum ${CONVERSION_RATE} points required for conversion` },
                { status: 400 }
            );
        }

        // Deduct points from votes (we'll need to track converted points)
        // For now, we'll use a simple approach: subtract points from the sum
        // In a more sophisticated system, we'd mark specific vote points as converted
        
        // Add ACC tokens to user balance
        await userAccTokenService.addTokens(userId, accTokens);

        // Record point history entry
        await pointHistoryService.create({
            user_id: userId,
            type: 'conversion',
            points: -pointsToConvert, // Negative to show deduction
            description: `Converted ${pointsToConvert} points to ${accTokens} ACC tokens`,
            poll_id: null
        });

        // Record ACC token addition
        await pointHistoryService.create({
            user_id: userId,
            type: 'acc_reward',
            points: accTokens,
            description: `Received ${accTokens} ACC tokens from point conversion`,
            poll_id: null
        });

        return NextResponse.json({
            success: true,
            points_converted: pointsToConvert,
            acc_tokens_awarded: accTokens,
            new_acc_balance: await userAccTokenService.getBalance(userId)
        }, { status: 200 });
    } catch (error) {
        console.error('Error in POST /api/users/[id]/convert-points:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

