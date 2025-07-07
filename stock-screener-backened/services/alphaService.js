const axios = require('axios');
const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

exports.fetchRSI = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`;
  const res = await axios.get(url);
  return res.data;
};

exports.fetchMACD = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${apiKey}`;
  const res = await axios.get(url);
  return res.data;
};

exports.fetchSMA = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=20&series_type=close&apikey=${apiKey}`;
  const res = await axios.get(url);
  return res.data;
};
