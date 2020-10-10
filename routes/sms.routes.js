const express = require('express');
const sms = require('../controllers/sms.controller.js');
const router = express.Router();

router.get('/', sms.smsSend);
router.post('/:id', sms.setStatus);
router.post('/:id/:id', sms.updateStatus);

module.exports = router