import UserModel from "../Models/UserModel.js";

import jwt from "jsonwebtoken";
import BRIEFCASE from "../service/secretKey.js";
import bcrypt from "bcrypt";

export async function getAllUsers(req, res) {
  const { role } = req.query;

  try {
    const users = await UserModel.getAllUsers(role);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(req, res) {
  const id = req.params.id;
  console.log(id);
  try {
    const user = await UserModel.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  // Authenticate user
  try {
    // Find user by his email
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist!" });
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
      return res.status(200).json({ message: "Logged in successfuly!" });
    } else {
      return res.status(400).json({ error: "Wrong credentials!" });
    }
  } catch (error) {
    return res.json(error);
  }
}

export function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}

export async function registerUser(req, res) {
  const { firstName, lastName, email, role, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    await UserModel.createUser(
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
}

export async function updateUserById(req, res) {
  const id = req.params.id;
  const { firstName, lastName, role } = req.body;
  const updatedUser = await UserModel.updateUserById(id, {
    firstName,
    lastName,
    role,
  });

  res.json(updatedUser);
}

export async function deleteUserById(req, res) {
  const id = req.params.id;
  try {
    const deletedUser = await UserModel.deleteUser(id);
    if (!deletedUser) {
      return res
        .status(400)
        .json({ error: `No user with id: ${id} was found.` });
    }
    res.status(200).json({
      message: `Successfully deleted user with id ${id}`,
      content: deletedUser,
    });
  } catch (error) {
    console.log(error);
  }
}
