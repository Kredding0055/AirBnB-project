/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//creates a new router for this route
const router = express.Router();

const apiRouter = require('./api');

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

router.get('/test1', (req,res) => {
  res.status(200)
  res.json({message: "hello world"})
})

// backend/routes/index.js
// ...
const apiRouter = require('./api');

router.use('/api', apiRouter);
// ...

module.exports = router;