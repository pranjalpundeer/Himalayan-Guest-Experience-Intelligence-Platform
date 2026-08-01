const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Datastore = require("nedb-promises");
const path = require("path");

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

// Mongoose 9 - async pre hooks don't need next()
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

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
