//api to get enterprise article detail
import { NextResponse } from 'next/server'
import { get_article_by_id } from '@/services/enterprise'

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const article = get_article_by_id(id)
    if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json({ article }, { status: 200 })
}