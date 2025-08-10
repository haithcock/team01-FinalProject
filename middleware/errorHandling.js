function basicErrorHandler(err, req, res, next) {
  console.error(err);               
    res.status(500).json({            
    message: "Server error." 
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({ message: "Page not found." });
}


function jsonParseHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "Invalid JSON." });
  }
  next(err); 
}

module.exports = {
  basicErrorHandler,
  notFoundHandler,
  jsonParseHandler
};