import { NextResponse } from 'next/server'
import { get_last_company_id, get_existing_articles_for_news_url, get_articles } from '@/services/enterprise'
import { create_article } from '@/services/enterprise'
import { generateComapnyArticleUsingGPT, getCompanyNewsFromNewsAi } from '@/services/polls/polls'
import fs from 'fs';
import { FAMOUS_COMPANIES_DATA } from '@/services/const';

export async function GET(req) {
    let last_company_id = get_last_company_id()
    let last_company_index = FAMOUS_COMPANIES_DATA.findIndex(company => company.id === last_company_id)
    let company_id = FAMOUS_COMPANIES_DATA[(last_company_index + 1) % FAMOUS_COMPANIES_DATA.length].id
    
    const {articles:{results:articles}} = await getCompanyNewsFromNewsAi(company_id);
    let generated_count = 0;

    for (const article of articles) {
        const article_data = await get_existing_articles_for_news_url(article.url)
        if (article_data.length == 0) {
            console.log("Generating company article: ", article.url)
            const generated_data = await generateComapnyArticleUsingGPT(article.title, article.body);
            create_article(article.url, company_id, generated_data.title, generated_data.content, generated_data.category, article.date)
            generated_count++;
        } else {
            console.log("Company article already exists: ", article.url)
        }
        if (generated_count >= 5) {
            break;
        }
    }

    const company_articles = get_articles(company_id, 5)
    const cached_articles = fs.existsSync('company_articles.json') ? fs.readFileSync('company_articles.json', 'utf8') : '{}';
    const cached_articles_data = JSON.parse(cached_articles);
    if (!cached_articles_data[company_id]) {
        cached_articles_data[company_id] = {
            articles: [],
            cached_timestamp: Date.now()
        };
    }
    cached_articles_data[company_id].articles = company_articles;
    cached_articles_data[company_id].cached_timestamp = Date.now();
    fs.writeFileSync('company_articles.json', JSON.stringify(cached_articles_data, null, 2));

    return NextResponse.json({ message: 'Received', data: company_articles }, { status: 200 })
}