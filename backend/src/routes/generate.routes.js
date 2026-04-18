const express = require('express');
const { generatePost } = require('../controllers/generate.controller');

const router = express.Router();

router.post('/generate', generatePost);

module.exports = router;