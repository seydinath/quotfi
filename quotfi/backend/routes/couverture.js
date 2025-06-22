const express = require('express');
const router = express.Router();
const couvertureController = require('../controllers/couvertureController');
const auth = require('../utils/auth');

router.post('/', auth, couvertureController.create);
router.get('/', auth, couvertureController.list);

module.exports = router;
