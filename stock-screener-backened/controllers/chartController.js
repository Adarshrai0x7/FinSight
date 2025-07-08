const axios = require('axios');
const apiKey = process.env.TWELVE_DATA_API_KEY;

// ✅ For stock or index data (Twelve Data works for both)
exports.getStockChartData = async (req, res) => {
  const symbol = req.params.symbol; // e.g., MSFT, RELIANCE.BSE

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${apiKey}`;
    const response = await axios.get(url);

    if (response.data.code === 400 || !response.data.values) {
      return res.status(404).json({ error: "No data found for the given symbol" });
    }

    const data = response.data.values.map((item) => ({
      time: item.datetime, // ✅ frontend expects "time"
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseInt(item.volume),
    }));

    res.json(data.reverse()); // ✅ reverse to show oldest first
  } catch (error) {
    console.error("📛 Stock Chart Error (Twelve Data):", error.message);
    res.status(500).json({ error: "Failed to fetch stock chart data" });
  }
};

// ✅ Reuse same endpoint for index data
exports.getIndexChartData = async (req, res) => {
  const symbol = req.params.symbol; // e.g., ^NSEI for NIFTY

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=200&apikey=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.code === 400 || !response.data.values) {
      return res.status(404).json({ error: "No data found for the given index symbol" });
    }

    const data = response.data.values.map((item) => ({
      time: item.datetime,
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseInt(item.volume),
    }));

    res.json(data.reverse());
  } catch (error) {
    console.error("📛 Index Chart Error (Twelve Data):", error.message);
    res.status(500).json({ error: "Failed to fetch index chart data" });
  }
};
