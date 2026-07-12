const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Datastore = require("nedb-promises");
const path = require("path");

// ── Mongoose Schema ───────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    role: { type: String, enum: ["guest", "staff", "admin"], default: "guest" },
    googleId: { type: String, default: null },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

// ── NeDB fallback store ───────────────────────────────────────────────────────
let nedbUsers = null;
const getUsersDB = () => {
  if (!nedbUsers) {
    nedbUsers = Datastore.create({
      filename: path.join(__dirname, "../db/users.db"),
      autoload: true,
    });
  }
  return nedbUsers;
};

module.exports = { UserMongoose: mongoose.model("User", userSchema), getUsersDB };
