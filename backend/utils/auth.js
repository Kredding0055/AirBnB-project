/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//imports the 'jsonwebtoken' library, used to create and verify JWTs
const jwt = require('jsonwebtoken');
// imports a 'jwtConfig' object from config/database.js which connects to .env variables
const { jwtConfig } = require('../config');
//gets secret and experation date of JWT token, both are in .env file
const { secret, expiresIn } = jwtConfig;
//imports user model
const { User } = require('../db/models');

/************************************************************************************************************************************************ */
//*                                     SEND A JWT COOKIE
/************************************************************************************************************************************************/

const setTokenCookie = (res, user) => {
  // Create the token
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

/************************************************************************************************************************************************ */
//*                                     RESTORE-USER
/************************************************************************************************************************************************/

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }
  
      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }
  
      if (!req.user) res.clearCookie('token');
  
      return next();
    });
  };

/************************************************************************************************************************************************ */
//*                                     CHECK CURRENT USER/THROW ERROR IF NO USER (checks autherization)
/************************************************************************************************************************************************/

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();
  
    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  }

/************************************************************************************************************************************************/

module.exports = { setTokenCookie, restoreUser, requireAuth };