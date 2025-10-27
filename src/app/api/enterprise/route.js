import { NextResponse } from 'next/server'
import { get_articles } from '@/services/enterprise'
import { FAMOUS_COMPANIES_DATA } from '@/services/const'
import fs from 'fs';

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const company_ids = searchParams.get('company_ids')?.split(',') || [];
    const limit = parseInt(searchParams.get('limit') || '5') || 5;

    // check cache using fs.
    const cached_articles = fs.existsSync('company_articles.json') ? fs.readFileSync('company_articles.json', 'utf8') : '{}';
    const cached_articles_data = JSON.parse(cached_articles);

    const all_articles = [];
    for (const company_id of company_ids) {
        const company = FAMOUS_COMPANIES_DATA.find(company => company.id === company_id);
        if (company) {
            if (cached_articles_data[company_id] && Date.now() - cached_articles_data[company_id].cached_timestamp < 3600 * 1000) {
                all_articles.push({
                    company_id: company_id,
                    company_name: company.name,
                    description: company.description,
                    articles: cached_articles_data[company_id].articles
                });
                continue;
            }
            else {
                const articles = get_articles(company_id, limit);
                all_articles.push({
                    company_id: company_id,
                    company_name: company.name,
                    description: company.description,
                    articles: articles
                });

                if (!cached_articles_data[company_id]) {
                    cached_articles_data[company_id] = {
                        articles: [],
                        cached_timestamp: Date.now()
                    };
                }

                cached_articles_data[company_id].articles = articles;
                cached_articles_data[company_id].cached_timestamp = Date.now();
                fs.writeFileSync('company_articles.json', JSON.stringify(cached_articles_data, null, 2));
            }
        }
    }
    return NextResponse.json({ message: 'Received', data: all_articles }, { status: 200 });
}