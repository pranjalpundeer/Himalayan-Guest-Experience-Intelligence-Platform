/**
 * Review Controller — Week 5 Database Integration
 * All endpoints now read/write from the real database.
 * Uses Mongoose when MONGO_URI is set, NeDB otherwise.
 */

const Review = require("../models/Review");
const { getNeDB, getDBType } = require("../db/connection");

const useMongo = () => getDBType() === "mongo";

const normaliseNeDB = (doc) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
};

const getAllReviews = async (req, res, next) => {
  try {
    let reviews;
    if (useMongo()) {
      reviews = await Review.find().sort({ createdAt: -1 });
    } else {
      const docs = await getNeDB().find({});
      reviews = docs.map(normaliseNeDB);
    }
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) { next(err); }
};

const searchReviews = async (req, res, next) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
  try {
    let results;
    if (useMongo()) {
      const regex = new RegExp(q, "i");
      results = await Review.find({ $or: [{ guestName: regex }, { review: regex }, { theme: regex }, { sentiment: regex }] });
    } else {
      const regex = new RegExp(q, "i");
      const docs = await getNeDB().find({ $or: [{ guestName: { $regex: regex } }, { review: { $regex: regex } }, { theme: { $regex: regex } }, { sentiment: { $regex: regex } }] });
      results = docs.map(normaliseNeDB);
    }
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) { next(err); }
};

const getReviewById = async (req, res, next) => {
  try {
    let review;
    if (useMongo()) {
      review = await Review.findById(req.params.id);
    } else {
      const doc = await getNeDB().findOne({ _id: req.params.id });
      review = normaliseNeDB(doc);
    }
    if (!review) return res.status(404).json({ success: false, error: "Review not found" });
    res.status(200).json({ success: true, data: review });
  } catch (err) { next(err); }
};

const createReview = async (req, res, next) => {
  try {
    const { guestName, rating, review, theme, sentiment, response: resp } = req.body;
    let created;
    if (useMongo()) {
      created = await Review.create({ guestName, rating, review, theme, sentiment, response: resp });
    } else {
      const now = new Date();
      const doc = await getNeDB().insert({ guestName, rating: Number(rating), review, theme: theme || "General", sentiment: sentiment || "Neutral", response: resp || "", createdAt: now, updatedAt: now });
      created = normaliseNeDB(doc);
    }
    res.status(201).json({ success: true, data: created });
  } catch (err) { next(err); }
};

const updateReview = async (req, res, next) => {
  try {
    let updated;
    if (useMongo()) {
      updated = await Review.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true });
    } else {
      const existing = await getNeDB().findOne({ _id: req.params.id });
      if (!existing) return res.status(404).json({ success: false, error: "Review not found" });
      await getNeDB().update({ _id: req.params.id }, { $set: { ...req.body, updatedAt: new Date() } });
      const doc = await getNeDB().findOne({ _id: req.params.id });
      updated = normaliseNeDB(doc);
    }
    if (!updated) return res.status(404).json({ success: false, error: "Review not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) { next(err); }
};

const deleteReview = async (req, res, next) => {
  try {
    let deleted;
    if (useMongo()) {
      deleted = await Review.findByIdAndDelete(req.params.id);
    } else {
      const doc = await getNeDB().findOne({ _id: req.params.id });
      if (!doc) return res.status(404).json({ success: false, error: "Review not found" });
      await getNeDB().remove({ _id: req.params.id });
      deleted = normaliseNeDB(doc);
    }
    if (!deleted) return res.status(404).json({ success: false, error: "Review not found" });
    res.status(200).json({ success: true, message: "Review deleted", data: deleted });
  } catch (err) { next(err); }
};

module.exports = { getAllReviews, searchReviews, getReviewById, createReview, updateReview, deleteReview };
