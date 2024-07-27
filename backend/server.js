import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();

// middlewares
app.use(express.json()); // for parsing req body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
  connectMongoDB();
});
