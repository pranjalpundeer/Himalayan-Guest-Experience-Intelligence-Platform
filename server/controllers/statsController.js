/**
 * Stats Controller — Week 5 Database Integration
 */
const Review = require("../models/Review");
const { getNeDB, getDBType } = require("../db/connection");

const getStats = async (req, res, next) => {
  try {
    let reviews;
    if (getDBType() === "mongo") {
      reviews = await Review.find();
    } else {
      const docs = await getNeDB().find({});
      reviews = docs;
    }

    const total = reviews.length;
    const positive = reviews.filter(r => r.sentiment === "Positive").length;
    const negative = reviews.filter(r => r.sentiment === "Negative").length;
    const neutral  = reviews.filter(r => r.sentiment === "Neutral").length;
    const avgRating = total > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
      : 0;

    const themeCounts = {};
    reviews.forEach(r => { if (r.theme) themeCounts[r.theme] = (themeCounts[r.theme] || 0) + 1; });
    const themes = Object.entries(themeCounts).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({ success: true, data: { total, positive, negative, neutral, averageRating: avgRating, themes } });
  } catch (err) { next(err); }
};

module.exports = { getStats };
