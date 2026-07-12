const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const { getDBType } = require("./db/connection");
const { UserMongoose, getUsersDB } = require("./models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_PLACEHOLDER",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET_PLACEHOLDER",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const googleId = profile.id;
        const avatar = profile.photos?.[0]?.value || "";

        if (getDBType() === "mongo") {
          let user = await UserMongoose.findOne({ $or: [{ googleId }, { email }] });
          if (!user) {
            user = await UserMongoose.create({ name, email, googleId, avatar, isVerified: true, role: "guest" });
          } else if (!user.googleId) {
            user.googleId = googleId;
            user.avatar = avatar;
            await user.save();
          }
          return done(null, user);
        } else {
          const db = getUsersDB();
          let user = await db.findOne({ $or: [{ googleId }, { email }] });
          if (!user) {
            user = await db.insert({ name, email, googleId, avatar, isVerified: true, role: "guest", createdAt: new Date() });
          }
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id || user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = getDBType() === "mongo"
      ? await UserMongoose.findById(id)
      : await getUsersDB().findOne({ _id: id });
    done(null, user);
  } catch (err) { done(err, null); }
});

module.exports = passport;
