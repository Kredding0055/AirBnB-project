/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//import and apply the express-async-errors package
require('express-async-errors');
//automatically logs info about incoming HTTP requests, can log response times,. Debugging aid
const morgan = require('morgan');
//Cross-Origin Resource Sharing - allows servers to indicate valid origins from which resources may be loaded onto browser. 
const cors = require('cors');
//CSRF Setup
const csurf = require('csurf');
//parses the cookie header sent by browser
const cookieParser = require('cookie-parser');
//protects Express app by setting various security related HTTP headers
const helmet = require('helmet');
//used to handle validation errors
const { ValidationError } = require('sequelize');
//used to determine the current running environment of the application 
const { environment } = require('./config');
//used to conditionally apply "production" or "development"
const isProduction = environment === 'production';
//imports routes folder
const routes = require('./routes');
//creates an instance of an Express application.
const app = express();

/************************************************************************************************************************************************ */
//*                                     BASIC APP.USE
/************************************************************************************************************************************************/

//mounts the routes defined in routes module to Express application
app.use(routes); 
//middleware for HTTP request logging.
app.use(morgan('dev'));
//sets up the cookie-parser middleware.
app.use(cookieParser());
//parses incoming requests with JSON payloads, gives access to parsed data in req.body
app.use(express.json());

/************************************************************************************************************************************************ */
//*                                     CROSS ORIGIN POLICY
/************************************************************************************************************************************************/

app.use(
  helmet.crossOriginResourcePolicy({ // function allows control of which origins can embed your resources (EX:images, scripts, etc.)
    policy: "cross-origin" //cross origin means the origin of the resource is from a different protocol, domain or port number
  })                      //ex: images loaded from another site 
);

/************************************************************************************************************************************************ */
//*                                     MIDDLEWARE FOR CSRF PROTECTION 
//*                          (Set the _csrf token and create req.csrfToken method)
/************************************************************************************************************************************************/

//applies the csurf middleware to all routes in the application.
//Secure primarily protects against network-based attacks.
//SameSite primarily protects against cross-site request forgery (CSRF) attacks.
  app.use(
    csurf({
      cookie: { //tells csurf to use cookies for storing the CSRF token, rather than sessions.
        secure: isProduction, // Ensures the cookie is only transmitted over secure HTTPS connections (connection security), If isProduction is true sets the Secure flag on the cookie 
        sameSite: isProduction && "Lax",//Controls how cookies are sent with cross-site requests, "lax" - Cookies are sent when users navigate to the origin site from external sites.
        httpOnly: true //cookie will only be sent in http
      }
    })
  );

/************************************************************************************************************************************************ */
//*                                     ENABLING CORS ONLY IN DEVELOPMENT
/************************************************************************************************************************************************/

//implemented by browsers to restrict web pages from making requests to a different web page.
if (!isProduction) { // checks if app is not running in production mode
    app.use(cors());
  }

/************************************************************************************************************************************************ */
//*                                     CATCH UNHANDLED REQUESTS/FOWARD TO ERROR HANDLER
/************************************************************************************************************************************************/

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

/************************************************************************************************************************************************ */
//*                                     PROCESS SEQUELIZE ERRORS
/************************************************************************************************************************************************/

app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

/************************************************************************************************************************************************ */
//*                                     ERROR FORMATTER
/************************************************************************************************************************************************/

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});


module.exports = app;