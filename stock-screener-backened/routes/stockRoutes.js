const express = require('express');
const router = express.Router();

const technicalController = require('../controllers/technicalController');
const fundamentalController = require('../controllers/fundamentalController');
const chartController = require('../controllers/chartController');

// Technical Indicators
router.get('/technical/rsi/:symbol', technicalController.getRSI);
router.get('/technical/macd/:symbol', technicalController.getMACD);
router.get('/technical/sma/:symbol', technicalController.getSMA);

// Fundamental Data
router.get('/fundamentals/:symbol', fundamentalController.getFundamentals);

// Charting Tools (Unified API for stock + index)
router.get('/chart/:symbol', chartController.getChartData);

module.exports = router;
