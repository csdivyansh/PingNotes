import express from "express";
import passport from "../services/googleAuth.service.js";
import { generateToken } from "../services/googleAuth.service.js";

const router = express.Router();

// Google OAuth for Users
router.get("/google/user", passport.authenticate("google-user", { scope: ["profile", "email", "https://www.googleapis.com/auth/drive.file"] }));

router.get("/google/user/callback", 
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