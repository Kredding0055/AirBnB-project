/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//creates a new router for this route
const router = express.Router();
//gets api folder
const apiRouter = require('./api');

/************************************************************************************************************************************************ */
//*                                     ROUTER CONNECTIONS
/************************************************************************************************************************************************/

router.use('/api', apiRouter);

/************************************************************************************************************************************************ */
//*                                     test Function "hello world"
/************************************************************************************************************************************************/

router.get('/hello/world', function(req, res) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

/************************************************************************************************************************************************ */
//*                                     ADD XSRF-TOKEN COOKIE
/************************************************************************************************************************************************/

router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

/************************************************************************************************************************************************/

module.exports = router;