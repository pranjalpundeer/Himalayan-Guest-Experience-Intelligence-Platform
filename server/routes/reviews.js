const express = require("express");
const router = express.Router();

const {
  getAllReviews,
  searchReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const validateReview = require("../middleware/validateReview");
const { protect } = require("../middleware/auth");

// IMPORTANT: /search must come before /:id
// otherwise express will treat "search" as an id param
router.get("/search", searchReviews);

router.get("/", getAllReviews);
router.get("/:id", getReviewById);

// Write operations require authentication (Week 6)
router.post("/", protect, validateReview, createReview);
router.put("/:id", protect, updateReview);
router.patch("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
