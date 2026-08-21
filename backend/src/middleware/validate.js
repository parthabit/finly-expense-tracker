const ApiError = require("../utils/ApiError");

// Validates req.body against a Zod schema, replacing it with the parsed (typed) result.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    return next(new ApiError(400, "Validation failed", errors));
  }
  req.body = result.data;
  next();
};

module.exports = validate;
