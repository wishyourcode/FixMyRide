import validationResult from "express-validator";
import ApiError from "../utils/api-error.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extratedErrors = [];
  errors.array().map((err) => extratedErrors.push({ [err.path]: err.msg }));
  throw new ApiError(422, "Recieved data is not valid", extratedErrors);
};

export default validate;
