const axios = require('axios');
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

exports.fetchStockChartData = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

exports.fetchIndexChartData = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};
