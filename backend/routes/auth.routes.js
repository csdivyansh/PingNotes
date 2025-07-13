import express from "express";
import passport from "../services/googleAuth.service.js";
import { generateToken } from "../services/googleAuth.service.js";
import User from "../models/user.model.js";
import Teacher from "../models/teacher.model.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

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

// Check if user has Google Drive access
router.get("/google/drive/status", async (req, res) => {
  try {
    console.log("Checking Google Drive status for user");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-jwt-secret-for-development"
    );
    console.log("Token decoded:", { userId: decoded.id, role: decoded.role });

    let user;

    if (decoded.role === "user") {
      user = await User.findById(decoded.id);
      console.log("User found:", {
        userId: user?._id,
        hasAccessToken: !!user?.googleAccessToken,
      });
    } else if (decoded.role === "teacher") {
      user = await Teacher.findById(decoded.id);
      console.log("Teacher found:", {
        teacherId: user?._id,
        hasAccessToken: !!user?.googleAccessToken,
      });
    } else {
      console.log("Invalid role:", decoded.role);
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const hasDriveAccess = !!(
      user.googleAccessToken && user.googleRefreshToken
    );
    console.log("Drive access status:", hasDriveAccess);

    res.json({ hasDriveAccess });
  } catch (error) {
    console.error("Drive status check error:", error);
    res.status(500).json({ message: "Error checking Drive access" });
  }
});

// Google OAuth for Users
router.get(
  "/google/user",
  passport.authenticate("google-user", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive.file"],
  })
);

router.get(
  "/google/user/callback",
  (req, res, next) => {
    // Log the full request URL and query params
    console.log("[Google User Callback] URL:", req.originalUrl);
    console.log("[Google User Callback] Query:", req.query);
    next();
  },
  passport.authenticate("google-user", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user, "user");
      // Redirect to frontend with token
      res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/auth/success?token=${token}&role=user`
      );
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error`
      );
    }
  }
);

// Google OAuth for Teachers
router.get(
  "/google/teacher",
  passport.authenticate("google-teacher", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive.file"],
  })
);

router.get(
  "/google/teacher/callback",
  (req, res, next) => {
    // Log the full request URL and query params
    console.log("[Google Teacher Callback] URL:", req.originalUrl);
    console.log("[Google Teacher Callback] Query:", req.query);
    next();
  },
  passport.authenticate("google-teacher", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user, "teacher");
      // Redirect to frontend with token
      res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/auth/success?token=${token}&role=teacher`
      );
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error`
      );
    }
  }
);

// Logout route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
