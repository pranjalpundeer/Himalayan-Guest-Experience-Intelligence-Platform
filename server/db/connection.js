/**
 * Database Connection
 *
 * Connects to MongoDB when MONGO_URI is provided in .env.
 * Falls back to an embedded NeDB file-based store for local dev / testing
 * so the server works out of the box without any external service.
 *
 * Usage (in index.js):
 *   const { connectDB, getDB } = require('./db/connection');
 *   await connectDB();
 */

const mongoose = require("mongoose");
const Datastore = require("nedb-promises");
const path = require("path");

let dbType = "nedb"; // "mongo" | "nedb"
let nedbReviews = null;

/**
 * Connect to the configured database.
 * Call once at server startup before mounting routes.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && !mongoUri.includes("your_mongo")) {
    try {
      await mongoose.connect(mongoUri);
      dbType = "mongo";
      console.log("✅ Connected to MongoDB");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err.message);
      console.log("⚠️  Falling back to embedded NeDB store");
      dbType = "nedb";
    }
  } else {
    console.log("ℹ️  MONGO_URI not set — using embedded NeDB (local file DB)");
    dbType = "nedb";
  }

  if (dbType === "nedb") {
    nedbReviews = Datastore.create({
      filename: path.join(__dirname, "reviews.db"),
      autoload: true,
    });
    await seedNeDB(nedbReviews);
  }
};

/** Seed NeDB with sample data if the store is empty */
const seedNeDB = async (store) => {
  const count = await store.count({});
  if (count > 0) return;

  const seed = [
    { _id: "r1", guestName: "Ananya Sharma", rating: 5, review: "The staff at this resort went above and beyond. Every morning the team greeted us with warm chai and helped plan our treks.", sentiment: "Positive", theme: "Hospitality", response: "Thank you so much Ananya! We are thrilled our team made your stay unforgettable.", createdAt: new Date(), updatedAt: new Date() },
    { _id: "r2", guestName: "Rohan Mehta", rating: 2, review: "Disappointed with the food quality. The buffet options were very limited and the dal was watery.", sentiment: "Negative", theme: "Food", response: "We sincerely apologise Rohan. We have shared this feedback with our culinary team.", createdAt: new Date(), updatedAt: new Date() },
    { _id: "r3", guestName: "Priya Nair", rating: 4, review: "Rooms were spotless and the housekeeping team was very prompt. Loved the attention to detail.", sentiment: "Positive", theme: "Cleanliness", response: "Thank you Priya! Our housekeeping team works hard to maintain the highest standards.", createdAt: new Date(), updatedAt: new Date() },
    { _id: "r4", guestName: "James Okafor", rating: 3, review: "The location is beautiful and peaceful but getting to the nearest town took about 45 minutes.", sentiment: "Neutral", theme: "Location", response: "Thank you for the feedback James. We offer a complimentary shuttle to town twice daily.", createdAt: new Date(), updatedAt: new Date() },
    { _id: "r5", guestName: "Kavya Reddy", rating: 5, review: "The trekking packages offered by the resort were phenomenal. Our guide Deepak was knowledgeable.", sentiment: "Positive", theme: "Adventure", response: "We are so glad Deepak made your trek memorable Kavya!", createdAt: new Date(), updatedAt: new Date() },
    { _id: "r6", guestName: "Michael Torres", rating: 1, review: "Waited over 40 minutes for room service and when it arrived the order was wrong.", sentiment: "Negative", theme: "Service", response: "We are truly sorry Michael. This is not the standard we hold ourselves to.", createdAt: new Date(), updatedAt: new Date() },
    { _id: "r7", guestName: "Sneha Joshi", rating: 4, review: "The Ayurvedic spa treatments were absolutely divine. The therapists were skilled and professional.", sentiment: "Positive", theme: "Spa", response: "Thank you Sneha! Our spa team will be delighted to hear this.", createdAt: new Date(), updatedAt: new Date() },
    { _id: "r8", guestName: "David Kim", rating: 3, review: "Nice place overall but felt a bit overpriced for what was offered. The room was comfortable.", sentiment: "Neutral", theme: "Value", response: "Thank you David. We are always working to improve our value proposition.", createdAt: new Date(), updatedAt: new Date() },
  ];

  await store.insert(seed);
  console.log(`🌱 NeDB seeded with ${seed.length} reviews`);
};

/** Get the NeDB reviews datastore (only valid when dbType === "nedb") */
const getNeDB = () => nedbReviews;

/** Get the active database type: "mongo" | "nedb" */
const getDBType = () => dbType;

module.exports = { connectDB, getNeDB, getDBType };
