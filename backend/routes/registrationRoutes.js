const express = require('express');
const router = express.Router();
const { registerParticipant } = require('../controllers/registrationController');

router.post('/', registerParticipant);

module.exports = router;