/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//JSON Web Token - used for securely transmitting information between parties as a JSON object
const jwt = require('jsonwebtoken');
//contains settings for JWT, such as secret keys, expiration times, or other JWT-related configurations. loaded from config/index.js folder
const { jwtConfig } = require('../config');
//imports values from config/index.js
const { secret, expiresIn } = jwtConfig;
//imports the User model
const { User } = require('../db/models');

/************************************************************************************************************************************************ */
//*                                     SEND A JWT TOKEN (sending tokens in json object)
/************************************************************************************************************************************************/
const setTokenCookie = (res, user) => {
  // Create the token - put data into the token
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  //Secure the token (hide token info in JWT)
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token as a cookie in the response
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

/************************************************************************************************************************************************ */
//*                                     RESTORE USER
/************************************************************************************************************************************************/

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies; // <------- grabs cookie put into request from setTokenCookie function defined above
    req.user = null; // <----- sets user to null 
    
    //verify the token, Secret signiture
    return jwt.verify(token, secret, null, async (err, jwtPayload) => { // <---Secret is defined in .env file. Token is "signed" by the secert
      if (err) {                                                        // .verify checks that the signiture on the token matches our secret
        return next();                                                  // also checks that token from browser matches server side data
      }                                                                 // if succesful put token data into jwtPayload
  
      try {
        const { id } = jwtPayload.data; // <--attempts to grab id from jwtPayload
        req.user = await User.findByPk(id, { 
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }
  
      if (!req.user) res.clearCookie('token'); // <---- if no user found clears cookies, delets token
  
      return next();
    });
  };

/************************************************************************************************************************************************ */
//*                                     REQUIRE AUTH
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