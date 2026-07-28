// Thrown anywhere in a route/controller (including inside async functions,
// thanks to express-async-errors) lands here instead of crashing the process
// or leaking a raw stack trace to the client.

class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      message: isServerError ? "Internal server error" : err.message,
      details: err.details,
    },
  });
}

module.exports = { ApiError, notFoundHandler, errorHandler };
