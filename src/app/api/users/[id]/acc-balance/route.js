import { NextResponse } from 'next/server';
import { userAccTokenService } from '@/services/database/companyService';

// GET /api/users/[id]/acc-balance - Get user ACC token balance
export async function GET(req, { params }) {
    try {
        const userId = params.id;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const balance = await userAccTokenService.getBalance(userId);

        return NextResponse.json({
            acc_balance: balance
        }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/users/[id]/acc-balance:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

