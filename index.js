import express from "express";
const app = express();

import cookieParser from "cookie-parser";
import connectToDatabase from "./src/service/db.js";

// Routes
// const userRoutes = require("./api/routes/userRoutes");
import userRouter from "./src/routes/userRouter.js";

const port = 3000;

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  connectToDatabase();
});

app.use("/api", userRouter);
