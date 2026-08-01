const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const passport = require("../passport");
const { register, login, logout, getMe, googleCallback } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "Too many attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["guest", "staff", "admin"]).withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login",    loginLimiter, loginValidation,    validate, login);
router.post("/logout",   logout);
router.get("/me",        protect, getMe);

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get("/google/callback", (req, res) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  passport.authenticate("google", { session: false }, (err, user, info) => {
    console.log("Google OAuth callback - err:", err, "user:", user ? user.email : null, "info:", info);
    if (err) {
      console.error("OAuth error:", err);
      return res.redirect(`${clientUrl}/login?error=oauth_failed`);
    }
    if (!user) {
      console.error("OAuth no user:", info);
      return res.redirect(`${clientUrl}/login?error=oauth_failed`);
    }
    try {
      const jwt = require("jsonwebtoken");
      const token = jwt.sign({ id: user._id || user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
      return res.redirect(`${clientUrl}/dashboard?oauth=success&token=${token}`);
    } catch (e) {
      console.error("Token error:", e);
      return res.redirect(`${clientUrl}/login?error=oauth_failed`);
    }
  })(req, res);
});

module.exports = router;
