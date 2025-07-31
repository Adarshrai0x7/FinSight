const axios = require("axios");
const { RSI, MACD, SMA } = require("technicalindicators");
const yahooFinance = require("yahoo-finance2").default;

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// ✅ Fetch Fundamental Data
exports.fetchFundamentals = async (symbol) => {
  try {
    const quoteSummary = await yahooFinance.quoteSummary(symbol, {
      modules: ["defaultKeyStatistics", "financialData"],
    });

    return {
      peRatio: quoteSummary.defaultKeyStatistics?.trailingPE,
      eps: quoteSummary.defaultKeyStatistics?.trailingEps,
      marketCap: quoteSummary.defaultKeyStatistics?.marketCap,
      profitMargins: quoteSummary.financialData?.profitMargins,
      returnOnEquity: quoteSummary.financialData?.returnOnEquity,
      debtToEquity: quoteSummary.financialData?.debtToEquity,
    };
  } catch (error) {
    throw new Error("Failed to fetch fundamentals: " + error.message);
  }
};
exports.getQuoteFromYahoo = async (symbol) => {
  try {
    const quote = await yahooFinance.quote(symbol);

    if (!quote || !quote.regularMarketPrice) return null;

    return {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChangePercent,
      name: quote.shortName || quote.longName || "",
    };
  } catch (error) {
    console.error("❌ Yahoo Quote Error:", error.message);
    return null;
  }
};

// ✅ Fetch Technical Data for Stock Screener
exports.getStockData = async (ticker) => {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    const rawData = response.data["Time Series (Daily)"];

    if (!rawData) return null;

    const dates = Object.keys(rawData).sort(); // ascending
    const closes = dates.map((date) => parseFloat(rawData[date]["4. close"]));
    const volumes = dates.map((date) => parseInt(rawData[date]["5. volume"]));

    const latestClose = closes[closes.length - 1];
    const previousClose = closes[closes.length - 2];
    const change = ((latestClose - previousClose) / previousClose) * 100;

    // RSI
    const rsi = RSI.calculate({ values: closes, period: 14 }).pop();

    // MACD
    const macdSeries = MACD.calculate({
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });
    const macd = macdSeries[macdSeries.length - 1];

    // SMA
    const sma50 = SMA.calculate({ values: closes, period: 50 }).pop();
    const sma200 = SMA.calculate({ values: closes, period: 200 }).pop();

    // Volume Surge over last 20-day avg
    const avgVolume20 = volumes.slice(-20).reduce((sum, v) => sum + v, 0) / 20;
    const latestVolume = volumes[volumes.length - 1];
    const volumeSurge = ((latestVolume - avgVolume20) / avgVolume20) * 100;

    return {
      ticker,
      price: parseFloat(latestClose.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      rsi: parseFloat(rsi?.toFixed(2)),
      macd, // contains MACD, signal, histogram
      sma50: parseFloat(sma50?.toFixed(2)),
      sma200: parseFloat(sma200?.toFixed(2)),
      volumeSurge: parseFloat(volumeSurge?.toFixed(2)),
    };
  } catch (err) {
    console.error(`❌ Error fetching stock data for ${ticker}:`, err.message);
    return null;
  }

};
