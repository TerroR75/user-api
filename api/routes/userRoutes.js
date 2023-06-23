const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const jwt = require("jsonwebtoken");

router.get("/users", async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const user = await userController.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

router.post("user/login", async (req, res) => {
  // Authenticate user
});

router.post("/user", async (req, res) => {
  const { firstName, lastName, email, role, password } = req.body;
  try {
    await userController.createUser(firstName, lastName, email, role, password);
    res.status(201).json({ message: "User successfully created!" });
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      res.status(400).json({ message: "Email already is in use!" });
    } else {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

module.exports = router;
