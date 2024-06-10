import dotenv from "dotenv";
import express from 'express'
import connectDB from "./config/db.js";
import { app, server } from "./socket/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.Routes.js";

dotenv.config({ path: ".env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors()
);

app.use("/api/chat", userRoutes);

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    server.listen(port, () => console.log(`server is runnng on port:${port}`));
  })
  .catch((error) => console.log(`there was some error:${error}`));
