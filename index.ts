import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./router";
dotenv.config();

//prettier-ignore
mongoose.connect(`${process.env.MONGODB_URL}`).then(() => console.log("MongoDB connected"));

const app = express();
app.use(express.json());
app.use(router);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
