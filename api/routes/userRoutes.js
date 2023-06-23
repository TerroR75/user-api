const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const jwt = require("jsonwebtoken");
const BRIEFCASE = require("../database/secretKey");

// MIDDLEWARE IMPORTS
const authenticateToken = require("../Middleware/authenticateToken");

router.get("/users", authenticateToken, async (req, res) => {
  const { role } = req.query;

  try {
    const users = await userController.getAllUsers(role);
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

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  // Authenticate user
  try {
    // Find user by his email
    const user = await userController.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User with this email does not exist!" });
    }
    const serializedUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    if (user.password === password) {
      // Generate JWT token
      const accessToken = jwt.sign(serializedUser, BRIEFCASE.SECRET_KEY, {
        expiresIn: "15m",
      });
      res.cookie("token", accessToken, {
        httpOnly: true,
      });
      res.status(200).json({ message: "Logged in successfuly!" });
    } else {
      res.status(401).json({ error: "Wrong credentials!" });
    }
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

router.post("/user/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
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

router.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, role } = req.body;
  const updatedUser = await userController.updateUserById(id, {
    firstName,
    lastName,
    role,
  });

  res.json(updatedUser);
});

router.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await userController.deleteUser(id);
    res.status(200).json({
      message: `Successfully deleted user with id ${id}`,
      content: deletedUser,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
