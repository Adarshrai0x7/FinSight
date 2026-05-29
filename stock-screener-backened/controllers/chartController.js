const axios = require("axios");
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const yahooService = require("../services/yahooService");
const yahooFinance = require("yahoo-finance2").default;

exports.getChartData = async (req, res) => {
  const { symbol } = req.params;

  try {
    const result = await yahooFinance.historical(symbol, {
      period1: "2024-01-01", // Start date
      interval: "1d",
    });

    if (!result || result.length === 0) {
      throw new Error("No chart data available");
    }

    const parsedData = result.map((item) => ({
      time: item.date.toISOString().split("T")[0],
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    res.json(parsedData);
  } catch (error) {
    console.error("📉 Yahoo Chart API Error:", error.message);
    // FALLBACK TO MOCK DATA
    const data = [];
    let price = 150;
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 4;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      const volume = Math.floor(Math.random() * 1000000) + 500000;
      data.push({
        time: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
      });
      price = close;
    }
    res.json(data);
  }
};


exports.getQuoteData = async (req, res) => {
  const { symbol } = req.params;

  try {
    const quote = await yahooFinance.quote(symbol);

    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ error: "Symbol not found" });
    }

    res.json({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      name: quote.shortName || quote.longName,
      currency: quote.currency,
      exchange: quote.fullExchangeName,
    });
  } catch (error) {
    console.error("❌ Quote Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch quote data" });
  }
};



exports.getFilteredStocks = async (req, res) => {
  try {
    const filters = {
  rsi: req.body.technical?.rsi,
  macd: req.body.technical?.macd,
  movingAverages: req.body.technical?.movingAverages,
  volumeSurge: req.body.technical?.volumeSurge,
  peRatio: req.body.fundamental?.peRatio,
  marketCap: req.body.fundamental?.marketCap,
  debtEquity: req.body.fundamental?.debtEquity,
};

    const tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];
    const results = [];

    for (const ticker of tickers) {
      const stock = await yahooService.getStockData(ticker); // includes technicals
      const fundamentals = await yahooService.fetchFundamentals(ticker);

      if (!stock || !fundamentals) continue;

      // === TECHNICAL FILTERS ===

      // ✅ RSI
      if (filters.rsi?.enabled) {
        const rsi = stock.rsi;
        if ((filters.rsi.condition === "above" && rsi <= filters.rsi.value) ||
            (filters.rsi.condition === "below" && rsi >= filters.rsi.value)) {
          continue;
        }
      }

      // ✅ MACD Crossover
      if (filters.macd?.enabled && stock.macd) {
        const { MACD, signal } = stock.macd;
        if (filters.macd.crossover === "bullish" && MACD < signal) continue;
        if (filters.macd.crossover === "bearish" && MACD > signal) continue;
      }

      // ✅ SMA Cross
      if (filters.movingAverages?.enabled) {
        const sma50 = stock.sma50;
        const sma200 = stock.sma200;
        const cond = filters.movingAverages.condition;
        if (cond === "golden-cross" && sma50 <= sma200) continue;
        if (cond === "death-cross" && sma50 >= sma200) continue;
      }

      // ✅ Volume Surge
      if (filters.volumeSurge?.enabled) {
        if (stock.volumeSurge < filters.volumeSurge.percentage) continue;
      }

      // === FUNDAMENTAL FILTERS ===

      // ✅ P/E
      if (filters.peRatio?.enabled) {
        const pe = fundamentals.peRatio;
        if (pe == null || pe < filters.peRatio.min || pe > filters.peRatio.max) continue;
      }

      // ✅ Market Cap
      if (filters.marketCap?.enabled) {
        const mc = fundamentals.marketCap || 0;
        const size = filters.marketCap.size;
        if (
          (size === "large" && mc < 10e9) ||
          (size === "mid" && (mc < 2e9 || mc >= 10e9)) ||
          (size === "small" && (mc < 3e8 || mc >= 2e9))
        ) continue;
      }

      // ✅ Debt-to-Equity
      if (filters.debtEquity?.enabled) {
        const de = fundamentals.debtToEquity;
        if (de == null || de > filters.debtEquity.max) continue;
      }

      // ✅ All filters passed — Add stock
      results.push({
        ...stock,
        pe: fundamentals.peRatio,
        eps: fundamentals.eps,
        marketCap: fundamentals.marketCap,
        debtToEquity: fundamentals.debtToEquity,
        profitMargins: fundamentals.profitMargins,
        returnOnEquity: fundamentals.returnOnEquity,
      });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error("❌ Screener Error:", error.message);
    res.status(500).json({ error: "Stock screening failed" });
  }
};