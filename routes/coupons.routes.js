const express = require('express');
const coupons = require('../controllers/coupons.controller.js');
const router = express.Router();

router.get('/', coupons.getAll);
router.post('/post', coupons.insertAll);

module.exports = router
