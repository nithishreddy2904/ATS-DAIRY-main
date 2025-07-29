// dairy-backend/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Custom handling for known errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ success:false, message:'Invalid token' });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
