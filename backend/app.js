/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');

require('express-async-errors');//! <-----------is this correct code ???????????????????????????
const morgan = require('morgan');
//Cross-Origin Resource Sharing - allows servers to indicate valid origins from which resources may be loaded onto browser. 
const cors = require('cors');
//CSRF Setup
const csurf = require('csurf');
//parses the cookie header sent by browser
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const { restoreUser } = require('./utils/auth');
const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev'));
app.use(restoreUser);
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  
  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );
  
  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction, // <-----------Should be set to development?????
        sameSite: isProduction && "Lax",// <-----------Should be set to development?????
        httpOnly: true
      }
    })
  );

  // backend/app.js
const routes = require('./routes');

// ...

app.use(routes); // Connect all the routes

// backend/app.js
// ...
// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// backend/app.js
// ...
const { ValidationError } = require('sequelize');

// ...

// Process sequelize errors
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

// backend/app.js
// ...
// Error formatter
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