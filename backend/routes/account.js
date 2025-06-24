const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const auth = require('../utils/auth');

router.get('/', auth, accountController.list);
router.post('/', auth, accountController.create);
router.put('/:id', auth, accountController.update);
router.delete('/:id', auth, accountController.remove);

module.exports = router;
