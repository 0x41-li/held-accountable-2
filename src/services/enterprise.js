/*
Database operations for enterprise_articles using ../../../lib/sqlite.js
Table name: enterprise_articles
Schema:
id
news_url
company_id
title
content
category
post_date
created_at


create_artcle(news_url, company_id, title, content, category, post_date)
delete_article(id)
get_articles(company_id, limit)
get_last_company_id()
get_existing_articles_for_news_url(news_url)
*/

import db from "../../lib/sqlite";

export const create_article = (news_url, company_id, title, content, category, post_date) => {
    return db.prepare("INSERT INTO enterprise_articles (news_url, company_id, title, content, category, post_date) VALUES (?, ?, ?, ?, ?, ?)").run(news_url, company_id, title, content, category, post_date);
}

export const delete_article = (id) => {
    return db.prepare("DELETE FROM enterprise_articles WHERE id = ?").run(id);
}

export const get_articles = (company_id, limit) => {
    return db.prepare("SELECT * FROM enterprise_articles WHERE company_id = ? ORDER BY post_date DESC LIMIT ?").all(company_id, limit);
}

export const get_last_company_id = () => {
    const result = db.prepare("SELECT company_id FROM enterprise_articles ORDER BY id DESC LIMIT 1").get();
    return result ? result.company_id : 0;
}

export const get_existing_articles_for_news_url = (news_url) => {
    return db.prepare("SELECT * FROM enterprise_articles WHERE news_url = ?").all(news_url);
}

export const get_article_by_id = (id) => {
    return db.prepare("SELECT * FROM enterprise_articles WHERE id = ?").get(id);
}