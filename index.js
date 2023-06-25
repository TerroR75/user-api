import express from "express";
import cookieParser from "cookie-parser";
import connectToDatabase from "./src/service/db.js";
import errorHandler from "./src/Middleware/errorHandler.js";

// Routes
import userRouter from "./src/routes/userRouter.js";

const app = express();
const port = 3000;

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// ROUTER
app.use("/api", userRouter);

// CUSTOM MIDDLEWARE
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  connectToDatabase();
});
