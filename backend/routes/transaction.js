const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../utils/auth');

router.post('/', auth, transactionController.create);
router.get('/', auth, transactionController.list);

module.exports = router;
