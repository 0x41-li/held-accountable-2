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
    // if (fs.existsSync("trending_dump")) {
    //     const dump = JSON.parse(fs.readFileSync("trending_dump"));
    //     if (Date.now() - dump.last_timestamp > 300 * 1000) {
    //         data = await getTrendingData();
    //         fs.writeFileSync("trending_dump", JSON.stringify({ last_timestamp: Date.now(), data }));
    //     } else {
    //         data = dump.data;
    //     }
    //     return NextResponse.json({ message: 'Received', symbols: data }, { status: 200 });
    // }
    // data = await getTrendingData();
    data = [{"symbol":"AAPL","price":277.5601,"change":-0.43758866},{"symbol":"MSFT","price":490.81,"change":1.5833251},{"symbol":"AMD","price":219.39,"change":0.65146494},{"symbol":"NVDA","price":183.365,"change":0.5235469},{"symbol":"AMZN","price":227.37,"change":-0.941014},{"symbol":"GOOG","price":312.92,"change":-2.7836435},{"symbol":"META","price":669.67,"change":-0.556859},{"symbol":"BRK-B","price":493.61,"change":-2.127535},{"symbol":"TSLA","price":436.8626,"change":-3.9861627},{"symbol":"GM","price":75.645,"change":-0.5325528},{"symbol":"BTC","price":90007,"change":-0.3041438249363465},{"symbol":"ETH","price":3110.32,"change":1.1901017496759199},{"symbol":"BNB","price":895.47,"change":-0.2546234531840753},{"symbol":"SOL","price":135.89,"change":2.3381788431928388},{"symbol":"TRX","price":0.283126,"change":-1.069733217603387},{"symbol":"DOGE","price":0.143081,"change":1.9801471987319366},{"symbol":"ADA","price":0.439518,"change":3.2565220716443832}];
    // fs.writeFileSync("trending_dump", JSON.stringify({ last_timestamp: Date.now(), data }));
    return NextResponse.json({ message: 'Received', symbols: data }, { status: 200 });
}