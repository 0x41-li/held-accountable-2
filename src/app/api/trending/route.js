import { NextResponse } from 'next/server'
import { getCryptoSymbolPrices, getStockSymbolPrices } from '../../../../lib/trending'
import fs from 'fs';

const getTrendingData = async () => {
    const stock_list = await getStockSymbolPrices();
    const crypto_list = await getCryptoSymbolPrices();
    return [
        ...stock_list.map(q => ({
            symbol: q.symbol,
            price: q.regularMarketPrice,
            change: q.regularMarketChangePercent
        })),
        ...Object.keys(crypto_list).map(key => ({
            symbol: key.toUpperCase(),
            price: crypto_list[key].usd,
            change: crypto_list[key].usd_24h_change
        }))]
}
export async function GET(req) {
    let data = [];
    if (fs.existsSync("trending_dump")) {
        const dump = JSON.parse(fs.readFileSync("trending_dump"));
        if (Date.now() - dump.last_timestamp > 300 * 1000) {
            data = await getTrendingData();
            fs.writeFileSync("trending_dump", JSON.stringify({ last_timestamp: Date.now(), data }));
        } else {
            data = dump.data;
        }
        return NextResponse.json({ message: 'Received', symbols: data }, { status: 200 });
    }
    data = await getTrendingData();
    fs.writeFileSync("trending_dump", JSON.stringify({ last_timestamp: Date.now(), data }));
    return NextResponse.json({ message: 'Received', symbols: data }, { status: 200 });
}