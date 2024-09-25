/************************************************************************************************************************************************ */
//*                                     IMPORTS AND REQUIREMENTS
/************************************************************************************************************************************************/

//used to collect validation errors from the request
const { validationResult } = require('express-validator');

/************************************************************************************************************************************************ */
//*                                     HANDLING VALIDATION ERRORS
/************************************************************************************************************************************************/

// Check if there are any validation errors, format them into a standardized structure, Create and pass along error object w/ details about validation failures
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

/************************************************************************************************************************************************/

module.exports = {
  handleValidationErrors
};