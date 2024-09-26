/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express')
//creates a new router for this route
const router = express.Router();
//Used for hashing passwords
const bcrypt = require('bcryptjs');
//imports key functions from utils/auth.js. setTokenCookie creates JWT token, requireAuth verifies 'user' from a token
const { setTokenCookie, requireAuth } = require('../../utils/auth');
//imports user model
const { User } = require('../../db/models');
//used for validating and sanitizing request data
const { check } = require('express-validator');
//imports a function for handling errors
const { handleValidationErrors } = require('../../utils/validation');

/************************************************************************************************************************************************ */
//*                                     SIGN-UP
/************************************************************************************************************************************************/

//middleware for sign-up
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage("Invalid email"),
    check('username')
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .exists({ checkFalsy: true })
      .withMessage("Username is required"),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage("First Name is required"),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage("Last Name is required"),
    handleValidationErrors
  ];

//sign up
  router.post(
    '/',
    validateSignup,
    async (req, res, next) => {

      const { email, password, username, firstName, lastName } = req.body;

      const emailCheck = await User.findOne({
        where: {
          email: email
        }
      })
      const userNameCheck = await User.findOne({
        where:{
          username: username
        }
      })

      if (emailCheck) { //! <----------------------------Title needs to be removed, ask prof??????????????????
        const err = new Error("User already exists");
        err.status = 500;
        err.errors = { email: "User with that email already exists" };
        return next(err);
      }else if(userNameCheck) {
        const err = new Error("User already exists");
        err.status = 500;
        err.errors = { email: "User with that username already exists" };
        return next(err);
      }


      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword});
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
      return res.status(201).json({
        user: safeUser
      });
    }
  );

  /************************************************************************************************************************************************/

  module.exports = router;