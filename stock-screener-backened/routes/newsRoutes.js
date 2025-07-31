const express = require('express');
const router = express.Router();
const { getLatestNews, getTrendingNews } = require('../controllers/newsController');

router.get('/latest', getLatestNews);
router.get('/trending', getTrendingNews);

module.exports = router;
