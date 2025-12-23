import { NextResponse } from 'next/server';
import { companyPollService } from '@/services/database/companyService';

// GET /api/company-polls - Get all polls or get by ID
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const company = searchParams.get('company');
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        
        // Pagination parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        if (id) {
            // Get single poll by ID
            const poll = await companyPollService.getById(parseInt(id));
            if (!poll) {
                return NextResponse.json(
                    { error: 'Poll not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ poll }, { status: 200 });
        }

        // Get all polls with optional filters and pagination
        const filters = {};
        if (company) filters.company = company;
        if (category) filters.category = category;
        if (status !== null && status !== undefined) filters.status = parseInt(status);

        // Get total count for pagination metadata
        const totalCount = await companyPollService.getCount(filters);
        
        // Get paginated polls
        const polls = await companyPollService.getAll(filters, { limit, offset });
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return NextResponse.json({ 
            polls,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/company-polls:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/company-polls - Create a new poll
export async function POST(req) {
    try {
        const body = await req.json();
        const { url, category, company, image_url, title, content, status, vote_result, comment_count, section_ids, section_titles } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const poll = await companyPollService.create({
            url,
            category,
            company,
            image_url,
            title,
            content,
            status,
            vote_result,
            comment_count,
            section_ids,
            section_titles
        });
        return NextResponse.json({ poll }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/company-polls:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/company-polls - Update a poll
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        const poll = await companyPollService.update(id, updateData);
        return NextResponse.json({ poll }, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/company-polls:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/company-polls - Delete a poll
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        await companyPollService.delete(parseInt(id));
        return NextResponse.json(
            { message: 'Poll deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in DELETE /api/company-polls:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

