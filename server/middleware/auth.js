const jwt = require("jsonwebtoken");
const { getDBType } = require("../db/connection");
const { UserMongoose, getUsersDB } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "himalayan_jwt_secret_dev_key_2025";

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "Not authorised — no token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (getDBType() === "mongo") {
      req.user = await UserMongoose.findById(decoded.id);
    } else {
      req.user = await getUsersDB().findOne({ _id: decoded.id });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, error: "User no longer exists" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Not authorised — invalid token" });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, error: `Role '${req.user?.role}' is not allowed` });
  }
  next();
};

module.exports = { protect, authorize };
