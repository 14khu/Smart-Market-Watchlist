const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function fetchQuote(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      symbol,
      name: quote.longName || quote.shortName || symbol,
      price: quote.regularMarketPrice,
      dayChangePct: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`Failed to fetch ${symbol}:`, err.message);
    return null;
  }
}

module.exports = { fetchQuote };