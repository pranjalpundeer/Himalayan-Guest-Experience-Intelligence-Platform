const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDBType } = require("../db/connection");
const { UserMongoose, getUsersDB } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "himalayan_jwt_secret_dev_key_2025";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

const useMongo = () => getDBType() === "mongo";

// ── Helpers ──────────────────────────────────────────────────────────────────
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

const sendToken = (res, user, statusCode = 200) => {
  const token = signToken(user._id || user.id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const { password, ...safeUser } = user._doc || user;
  res.status(statusCode).json({ success: true, token, user: safeUser });
};

// ── REGISTER ─────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (useMongo()) {
      const exists = await UserMongoose.findOne({ email });
      if (exists) return res.status(400).json({ success: false, error: "Email already registered" });
      const user = await UserMongoose.create({ name, email, password, role });
      sendToken(res, user, 201);
    } else {
      const db = getUsersDB();
      const exists = await db.findOne({ email });
      if (exists) return res.status(400).json({ success: false, error: "Email already registered" });
      const hashed = await bcrypt.hash(password, 12);
      const user = await db.insert({ name, email, password: hashed, role: role || "guest", googleId: null, avatar: "", createdAt: new Date() });
      sendToken(res, user, 201);
    }
  } catch (err) { next(err); }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (useMongo()) {
      const user = await UserMongoose.findOne({ email }).select("+password");
      if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ success: false, error: "Invalid email or password" });
      sendToken(res, user);
    } else {
      const db = getUsersDB();
      const user = await db.findOne({ email });
      if (!user) return res.status(401).json({ success: false, error: "Invalid email or password" });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ success: false, error: "Invalid email or password" });
      sendToken(res, user);
    }
  } catch (err) { next(err); }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ── GET ME (protected) ────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) { next(err); }
};

// ── GOOGLE OAUTH CALLBACK ─────────────────────────────────────────────────────
const googleCallback = async (req, res) => {
  try {
    const { profile } = req;
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    if (!req.user) return res.redirect(`${clientUrl}/login?error=oauth_failed`);
    const token = signToken(req.user._id || req.user.id);
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect(`${clientUrl}/dashboard?oauth=success&token=${token}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=oauth_failed`);
  }
};

module.exports = { register, login, logout, getMe, googleCallback };
