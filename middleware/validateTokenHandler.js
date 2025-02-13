const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let authHeader = req.headers.Authorization || req.headers.authorization;

  // 🔥 Fix: If no auth header is provided, return 401 immediately
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }
    req.user = decoded.user;
    next();
  });
});

module.exports = validateToken;
