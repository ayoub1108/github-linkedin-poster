const express = require('express');
const { getAuthUrl, callback, sharePost } = require('../controllers/linkedin.controller');

const router = express.Router();

router.get('/linkedin/auth-url', getAuthUrl);
router.get('/linkedin/callback', callback);
router.post('/linkedin/share', sharePost);

module.exports = router;