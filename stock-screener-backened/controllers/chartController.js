const axios = require("axios");
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

exports.getChartData = async (req, res) => {
  const { symbol } = req.params;

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
    const response = await axios.get(url);
    const rawData = response.data;

    const timeSeries = rawData["Time Series (Daily)"];
    if (!timeSeries) {
      return res.status(404).json({ error: "No chart data available" });
    }

    // Transform into frontend-compatible format
    const parsedData = Object.entries(timeSeries).map(([date, values]) => ({
      time: date,
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
      volume: parseInt(values["5. volume"]),
    }));

    // Alpha Vantage returns latest first, we want oldest first
    res.json(parsedData.reverse());
  } catch (error) {
    console.error("📉 Chart API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
};
