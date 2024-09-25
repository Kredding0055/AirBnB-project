/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/
//creates a new router for this route
const router = require("express").Router();
//restoreUsers verifies the token sent in the request
const { restoreUser } = require("../../utils/auth.js");
//imports session.js
const sessionRouter = require('./session.js');
//imports users.js
const usersRouter = require('./users.js');
//imports spots.js
const spotsRouter = require("./spots.js")

/************************************************************************************************************************************************/

// Connect restoreUser middleware to the API router // <--------------------------????????????????????????
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null

/************************************************************************************************************************************************ */
//*                                     ROUTER CONNECTIONS
/************************************************************************************************************************************************/
router.use('restoreUser',restoreUser); //<------ is this corect????????????

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

/************************************************************************************************************************************************/

module.exports = router;

// Keep this route to test frontend setup in Mod 5
// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });
  
