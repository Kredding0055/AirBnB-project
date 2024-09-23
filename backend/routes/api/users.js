// backend/routes/api/users.js
const express = require('express')
const router = express.Router();

const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
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
      .isLength({min: 1})
      .withMessage('Please provide a valid first name'),
    check('lastName')
      .exists({ checkFalsy: true })
      .isLength({min: 1})
      .withMessage('Please provide a valid last name.'),
    handleValidationErrors
  ];


router.get('/:id', async (req, res, next) => {
  const userById = await User.findByPk(req.params.id);
  console.log(userById)
  if(userById){
  res.status(200);
  res.json({user:userById});
  } else {
  res.status(200);
  res.json({user: null});
  }
});

//validate user creation
  router.post(
    '/',
    validateSignup,
    async (req, res) => {

    console.log("REQ BODY: ", req.body)
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName,email, username, hashedPassword  });
  
      const safeUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;