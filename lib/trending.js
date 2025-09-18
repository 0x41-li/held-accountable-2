import yahooFinance from 'yahoo-finance2';

const STOCK_SYMBOLS = ["AAPL", "MSFT", "AMD", "S&P500", "NVDA", "AMZN", "GOOG", "META", "BRK-B", "TSLA", "GM"];
const CRYPTO_SYMBOLS = ["BTC", "ETH", "BNB", "SOL", "ADA", "TRX", "DOGE"];

export const getStockSymbolPrices = () => {
    return yahooFinance.quote(STOCK_SYMBOLS);
}

export const getCryptoSymbolPrices = () => {
    return fetch(`https://api.coingecko.com/api/v3/simple/price?symbols=${CRYPTO_SYMBOLS.join(",")}&vs_currencies=usd&include_24hr_change=true`)
        .then(response => response.json());
}