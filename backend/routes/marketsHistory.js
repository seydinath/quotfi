const express = require('express');
const router = express.Router();
const finnhubHistoryController = require('../controllers/finnhubHistoryController');

// GET /api/markets/history/:symbol
router.get('/history/:symbol', finnhubHistoryController.getHistory);

module.exports = router;
