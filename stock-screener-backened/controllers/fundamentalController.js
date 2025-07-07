const yahooService = require('../services/yahooService');

exports.getFundamentals = async (req, res) => {
  try {
    const data = await yahooService.fetchFundamentals(req.params.symbol);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
