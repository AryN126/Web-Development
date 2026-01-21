import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
const app = express();

// ----------------------------
// MIDDLEWARE
// ----------------------------
app.use(cors());
app.use(express.json());

// ----------------------------
// MONGODB CONNECTION
// ----------------------------
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ----------------------------
// ROUTES
// ----------------------------
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// ----------------------------
// UNMATCHED ROUTES
// ----------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
