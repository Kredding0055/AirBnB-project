/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/
//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express')
//importing Operator object - used for complex queries.
const { Op } = require('sequelize');
//Used for hashing passwords
const bcrypt = require('bcryptjs');
//imported from utils/auth.js. setTokenCookie creates JWT token,  restoreUsers verifies the token sent in the request
const { setTokenCookie, restoreUser } = require('../../utils/auth');
//Import the user model
const { User } = require('../../db/models');
//used for validating and sanitizing request data
const { check } = require('express-validator');
//imports a function for handling errors
const { handleValidationErrors } = require('../../utils/validation');
//creates a new router for this route
const router = express.Router();

/************************************************************************************************************************************************ */
//*                                     MIDDDLEWARE
/************************************************************************************************************************************************/

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];
  
/************************************************************************************************************************************************ */
//*                                     LOGOUT
/************************************************************************************************************************************************/

router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

/************************************************************************************************************************************************ */
//*                                     RESTORE SESSION USER
/************************************************************************************************************************************************/

router.get(
  '/',
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);  

/************************************************************************************************************************************************ */
//*                                     LOGIN
/************************************************************************************************************************************************/

router.post(
  '/',
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    const safeUser = {
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

/************************************************************************************************************************************************/

/* 
fetch('/api/session', { 
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": "fWwuoKLy-LxSZ0ezNPW19aNKulQY_LB7ljs0"
    },
    body: JSON.stringify({ credential:'demo@user.io', password: 'password'
    })
  }).then(res => res.json()).then(data => console.log(data));
*/

/************************************************************************************************************************************************/

module.exports = router;