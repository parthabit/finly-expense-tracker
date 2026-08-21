const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  statusCode = statusCode || 500;
  message = message || "Internal server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field ? field : "Field"} already exists`;
  }
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors && Array.isArray(err.errors) ? err.errors : undefined,
  });
};

module.exports = { notFound, errorHandler };
