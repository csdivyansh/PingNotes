import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: false }, // Optional for Google OAuth users
  googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
  googleAccessToken: { type: String }, // Store Google access token for Drive API
  googleRefreshToken: { type: String }, // Store refresh token
  profilePicture: { type: String }, // Google profile picture URL
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
});

// Pre-save hook to hash password (only if password exists)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare password
userSchema.methods.matchPassword = function (enteredPassword) {
  if (!this.password) return false; // Google OAuth users don't have password
  return bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model("User", userSchema);