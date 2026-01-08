import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import globalErrorHandler from "./middleware/errorMiddleware.js";

connectDB();

const app = express();

if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'))
}

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

app.use(globalErrorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
