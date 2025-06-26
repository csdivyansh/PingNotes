import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import rootRoutes from "./routes/root.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT

// DB connect
await connectDB();

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/", rootRoutes);
app.use("/teacher", teacherRoutes);
app.use("/user", userRoutes);
app.use("/group", groupRoutes); 
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
