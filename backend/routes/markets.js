const express = require('express');
const router = express.Router();
const finnhubController = require('../controllers/finnhubController');

// GET /api/markets/quote/:symbol
router.get('/quote/:symbol', finnhubController.getQuote);

module.exports = router;
