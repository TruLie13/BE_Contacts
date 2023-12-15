const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const resStatusCode = res.statusCode;
  const errorMessage = err.message;
  const stackTrace = err.stack;

  const statusCode = resStatusCode ? resStatusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: errorMessage,
        stackTrace: stackTrace,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: errorMessage,
        stackTrace: stackTrace,
      });
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: errorMessage,
        stackTrace: stackTrace,
      });
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: errorMessage,
        stackTrace: stackTrace,
      });
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: errorMessage,
        stackTrace: stackTrace,
      });
    default:
      console.log("No errors.");
      break;
  }
};

module.exports = errorHandler;
