const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const cookie = req.cookies.jwtoken;
  console.log(cookie);

  const response = jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET);
  console.log(response);
  req.user = response;

  next();
};

module.exports = authorization;
