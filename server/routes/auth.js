const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const passport = require("../passport");
const { register, login, logout, getMe, googleCallback } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// ── Rate Limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
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

// ── Validation Rules ──────────────────────────────────────────────────────────
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

// ── Auth Routes ───────────────────────────────────────────────────────────────
router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login",    loginLimiter, loginValidation,    validate, login);
router.post("/logout",   logout);
router.get("/me",        protect, getMe);

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login?error=oauth_failed", session: false }),
  googleCallback
);

module.exports = router;
