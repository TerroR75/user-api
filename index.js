const express = require("express");
const app = express();
const connectToDatabase = require("./api/database/index");

// Routes
const userRoutes = require("./api/routes/userRoutes");

const port = 3000;

// MIDDLEWARE
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  connectToDatabase();
});

app.use("/api", userRoutes);
