/**
 * Review Model (Mongoose Schema)
 *
 * Week 5: Database Integration
 * Database: MongoDB (via Mongoose ODM)
 *
 * When MONGO_URI is set in .env the server connects to the real MongoDB instance.
 * During local development without a live MongoDB, the server falls back to an
 * embedded NeDB store so all endpoints still work for testing.
 *
 * Collection: reviews
 */

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
      maxlength: [100, "Guest name cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxlength: [2000, "Review text cannot exceed 2000 characters"],
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },
    theme: {
      type: String,
      trim: true,
      default: "General",
    },
    response: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search performance
reviewSchema.index({ guestName: "text", review: "text", theme: "text", sentiment: "text" });

// Virtual: expose Mongoose _id as id for API consistency
reviewSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("Review", reviewSchema);
