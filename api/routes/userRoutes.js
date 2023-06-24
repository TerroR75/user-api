const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const jwt = require("jsonwebtoken");
const BRIEFCASE = require("../database/secretKey");
const bcrypt = require("bcrypt");

// MIDDLEWARE IMPORTS
const authenticateToken = require("../Middleware/authenticateToken");
const registerValidation = require("../Middleware/registerValidation");

router.get("/users", authenticateToken, async (req, res) => {
  const { role } = req.query;

  try {
    const users = await userController.getAllUsers(role);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const user = await userController.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

// Signing in
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  // Authenticate user
  try {
    // Find user by his email
    const user = await userController.getUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: "User with this email does not exist!" });
    }
    const serializedUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate JWT token
      const accessToken = jwt.sign(serializedUser, BRIEFCASE.SECRET_KEY, {
        expiresIn: "30m",
      });
      res.cookie("token", accessToken, {
        httpOnly: true,
      });
      res.status(200).json({ message: "Logged in successfuly!" });
    } else {
      res.status(400).json({ error: "Wrong credentials!" });
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

// Registering users
router.post("/user", registerValidation, async (req, res) => {
  const { firstName, lastName, email, role, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    await userController.createUser(
      firstName,
      lastName,
      email,
      role,
      hashedPassword
    );
    res.status(201).json({ message: "User successfully created!" });
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      res.status(400).json({ error: "Email is already in use!" });
    } else {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.patch("/user/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, role } = req.body;
  const updatedUser = await userController.updateUserById(id, {
    firstName,
    lastName,
    role,
  });

  res.json(updatedUser);
});

router.delete("/user/:id", authenticateToken, async (req, res) => {
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
