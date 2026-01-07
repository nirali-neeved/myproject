import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import globalErrorHandler from "./middleware/errorMiddleware.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(globalErrorHandler)