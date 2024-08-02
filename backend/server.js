import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middlewares
app.use(express.json()); // for parsing req body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
  connectMongoDB();
});
