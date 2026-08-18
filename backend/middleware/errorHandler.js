export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // Format validation errors if from Yup or Mongoose
  let formattedErrors = [];
  if (err.inner && Array.isArray(err.inner)) {
    formattedErrors = err.inner.map((e) => ({
      field: e.path,
      message: e.message
    }));
  } else if (err.errors) {
    formattedErrors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message
    }));
  } else if (err.error) {
    formattedErrors = [err.error];
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[Unhandled Error]', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: formattedErrors.length > 0 ? formattedErrors : [message]
  });
};
