const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  
  if(err.name==="CastError")
  {
    const message=`Resource not found. CastError: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  
  if(err.code===11000)
  {
    const message=`Dupilcate ${Object.keys(err.keyValue)} Entered Moron!`
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    error:err.stack
  });

   // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};