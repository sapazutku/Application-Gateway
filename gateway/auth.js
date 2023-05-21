const jwt = require("jsonwebtoken");

const SECRET_KEY = "123"; // should be stored securely and not hard-coded

exports.generateToken = (username) => {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    next();
  });
};
