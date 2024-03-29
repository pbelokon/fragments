// src/routes/index.js
const { createSuccessResponse } = require('../response');
const { authenticate } = require('../authorization');

const express = require('express');

const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();
const { hostname } = require('os');
/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  const successResponse = createSuccessResponse({
    author,
    // Use your own GitHub URL for this...
    githubUrl: 'https://github.com/pbelokon/fragments',
    version,
    hostname: hostname(),
  });
  res.status(200).json(successResponse);
});

module.exports = router;
