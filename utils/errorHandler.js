const errorHandler = (err, req, res, next) => {
    console.error(err);
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: 'error',
      statusCode: statusCode,
      message: err.message || 'Internal Server Error'
    });
  };
  
  module.exports = errorHandler;