const express = require('express');
const router = express.Router();
const topVolatilityHandler = require('../controllers/topVolatilityController');

// GET /api/markets/top-volatility
router.get('/top-volatility', topVolatilityHandler);

// Expose the volatility controller on the root of this router
router.get('/', topVolatilityHandler);

module.exports = router;
