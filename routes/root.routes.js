import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("PingNotes API is live");
});

export default router;
