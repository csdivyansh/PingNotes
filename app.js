import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import rootRoutes from "./routes/root.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import noteRoutes from "./routes/note.routes.js";
import subjectRoutes from "./routes/subject.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT

// DB connect
await connectDB();

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/', rootRoutes)
app.use('/admin', adminRoutes)
app.use('/api/users', userRoutes)
app.use('/api/notes', noteRoutes) 
app.use("/api/subjects", subjectRoutes);
app.use('/api/groups', groupRoutes)
app.use('/api/teachers', teacherRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
