export const successResponse = (data, message = "Success") => {
  return {
    status: "success",
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const errorResponse = (message, statusCode = 500) => {
  return {
    status: "error",
    message,
    timestamp: new Date().toISOString(),
  };
};
