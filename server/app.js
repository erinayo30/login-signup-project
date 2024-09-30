const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./route/route");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use("/api/user/", userRouter);

const PORT = process.env.PORT || 8000;

mongoose
  .connect("mongodb://localhost:27017/Reg-Form")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error", error.message));

app.listen(8000, () => {
  console.log(`app is running on ${PORT}`);
});
