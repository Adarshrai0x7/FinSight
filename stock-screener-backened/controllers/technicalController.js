const alphaService = require('../services/alphaService');

exports.getRSI = async (req, res) => {
  try {
    const data = await alphaService.fetchRSI(req.params.symbol);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMACD = async (req, res) => {
  try {
    const data = await alphaService.fetchMACD(req.params.symbol);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSMA = async (req, res) => {
  try {
    const data = await alphaService.fetchSMA(req.params.symbol);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
