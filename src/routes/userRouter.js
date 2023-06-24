import express from "express";

import {
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  updateUserById,
  deleteUserById,
} from "../Controllers/UserController.js";

const userRouter = express.Router();
// MIDDLEWARE IMPORTS
import authenticateToken from "../Middleware/authenticateToken.js";
import registerValidation from "../Middleware/registerValidation.js";

// Fetching users
userRouter.get("/users", authenticateToken, getAllUsers);

userRouter.get("/user/:id", authenticateToken, getUserById);

// Authentication / Authorization
userRouter.post("/user/login", loginUser);

userRouter.post("/user/logout", logoutUser);

userRouter.post("/user", registerValidation, registerUser);

// User Manipulation
userRouter.patch("/user/:id", authenticateToken, updateUserById);

userRouter.delete("/user/:id", authenticateToken, deleteUserById);

export default userRouter;
