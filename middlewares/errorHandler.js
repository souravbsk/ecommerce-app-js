app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging

  const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
  const responseMessage = err.message || "Internal Server Error"; // Default message

  res.status(statusCode).json({
    success: false,
    message: responseMessage,
  });
});
