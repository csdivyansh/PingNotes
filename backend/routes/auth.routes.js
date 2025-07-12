import express from "express";
import passport from "../services/googleAuth.service.js";
import { generateToken } from "../services/googleAuth.service.js";
import User from "../models/user.model.js";
import Teacher from "../models/teacher.model.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google One Tap/Sign-In endpoint
router.post("/google/onetap", async (req, res) => {
  const { credential, role } = req.body;
  if (!credential || !role) {
    return res.status(400).json({ message: "Missing credential or role" });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // payload: { sub, email, name, picture, ... }
    let userOrTeacher, token, dbRole;
    if (role === "student" || role === "user") {
      dbRole = "user";
      userOrTeacher = await User.findOne({ googleId: payload.sub });
      if (!userOrTeacher) {
        userOrTeacher = await User.findOne({ email: payload.email });
        if (userOrTeacher) {
          userOrTeacher.googleId = payload.sub;
          userOrTeacher.profilePicture = payload.picture;
          await userOrTeacher.save();
        } else {
          userOrTeacher = await User.create({
            googleId: payload.sub,
            name: payload.name,
            email: payload.email,
            profilePicture: payload.picture,
          });
        }
      }
      token = generateToken(userOrTeacher, dbRole);
    } else if (role === "teacher") {
      dbRole = "teacher";
      userOrTeacher = await Teacher.findOne({ googleId: payload.sub });
      if (!userOrTeacher) {
        userOrTeacher = await Teacher.findOne({ email: payload.email });
        if (userOrTeacher) {
          userOrTeacher.googleId = payload.sub;
          userOrTeacher.profilePicture = payload.picture;
          await userOrTeacher.save();
        } else {
          userOrTeacher = await Teacher.create({
            googleId: payload.sub,
            name: payload.name,
            email: payload.email,
            department: "General",
            profilePicture: payload.picture,
          });
        }
      }
      token = generateToken(userOrTeacher, dbRole);
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
    res.json({ token, user: userOrTeacher });
  } catch (err) {
    console.error("Google One Tap error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

// Google OAuth for Users
router.get("/google/user", passport.authenticate("google-user", { scope: ["profile", "email", "https://www.googleapis.com/auth/drive.file"] }));

router.get("/google/user/callback", 
  (req, res, next) => {
    // Log the full request URL and query params
    console.log("[Google User Callback] URL:", req.originalUrl);
    console.log("[Google User Callback] Query:", req.query);
    next();
  },
  passport.authenticate("google-user", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    try {
      const token = generateToken(req.user, "user");
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/success?token=${token}&role=user`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error`);
    }
  }
);

// Google OAuth for Teachers
router.get("/google/teacher", passport.authenticate("google-teacher", { scope: ["profile", "email", "https://www.googleapis.com/auth/drive.file"] }));

router.get("/google/teacher/callback", 
  (req, res, next) => {
    // Log the full request URL and query params
    console.log("[Google Teacher Callback] URL:", req.originalUrl);
    console.log("[Google Teacher Callback] Query:", req.query);
    next();
  },
  passport.authenticate("google-teacher", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    try {
      const token = generateToken(req.user, "teacher");
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/success?token=${token}&role=teacher`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error`);
    }
  }
);

// Logout route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router; 