export default function errorHandler(error, req, res, next) {
  if (error.name === "CastError") {
    return res
      .status(400)
      .json(
        formatError(
          error.name,
          error.message,
          "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer."
        )
      );
  } else if (error.name === "ValidationError") {
    return res
      .status(400)
      .json(formatError(error.name, error.message, error.details));
  } else if (error.name === "MongoServerError") {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      return res
        .status(400)
        .json(
          formatError(error.name, "Email is already in use!", error.message)
        );
    }
  }

  console.log(error);
  return res
    .status(500)
    .json(
      formatError("Internal server error", "Something went wrong...", error)
    );
}

function formatError(errorName, errorMessage, details) {
  return {
    error: errorName,
    message: errorMessage,
    details: details,
  };
}
