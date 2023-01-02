const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const jsonify = (fields) => (req, _res, next) => {
  try {
    fields.forEach((field) => {
      if (req.body[field]) {
        req.body[field] = req.body[field].split(',');
      }
    });
  } catch (e) {
    return next(new ApiError(httpStatus.BAD_REQUEST, `invalid request body: ${e.message}`));
  }
  return next();
};

module.exports = jsonify;
