const axios = require('axios');

const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

// For stock data (e.g., MSFT, RELIANCE)
exports.getStockChartData = async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
    const response = await axios.get(url);
    const rawData = response.data["Time Series (Daily)"];

    if (!rawData) {
      return res.status(404).json({ error: "No data found for the given symbol" });
    }

    const data = Object.entries(rawData).map(([date, values]) => ({
      date,
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
    }));

    res.json(data.reverse());
  } catch (error) {
    console.error("Stock Chart Error:", error.message);
    res.status(500).json({ error: "Failed to fetch stock chart data" });
  }
};

// For index data (e.g., NIFTY 50, SENSEX)
exports.getIndexChartData = async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
    const response = await axios.get(url);
    const rawData = response.data["Time Series (Daily)"];

    if (!rawData) {
      return res.status(404).json({ error: "No data found for the given index symbol" });
    }

    const data = Object.entries(rawData).map(([date, values]) => ({
      date,
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
    }));

    res.json(data.reverse());
  } catch (error) {
    console.error("Index Chart Error:", error.message);
    res.status(500).json({ error: "Failed to fetch index chart data" });
  }
};
