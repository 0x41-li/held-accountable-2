import { NextResponse } from 'next/server';
import { companyService } from '@/services/database/companyService';

// GET /api/companies - Get all companies or get by ID
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Get single company by ID
            const company = await companyService.getById(parseInt(id));
            if (!company) {
                return NextResponse.json(
                    { error: 'Company not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ company }, { status: 200 });
        }

        // Get all companies
        const companies = await companyService.getAll();
        return NextResponse.json({ companies }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/companies:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/companies - Create a new company
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, url, logo } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const company = await companyService.create({ name, url, logo });
        return NextResponse.json({ company }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/companies:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/companies - Update a company
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, url, logo } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        const company = await companyService.update(id, { name, url, logo });
        return NextResponse.json({ company }, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/companies:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/companies - Delete a company
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

        await companyService.delete(parseInt(id));
        return NextResponse.json(
            { message: 'Company deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in DELETE /api/companies:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

