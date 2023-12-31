import UserModel from "../Models/UserModel.js";

import jwt from "jsonwebtoken";
import BRIEFCASE from "../service/secretKey.js";
import bcrypt from "bcrypt";

export async function getAllUsers(req, res) {
  const { role } = req.query;

  try {
    const users = await UserModel.getAllUsers(role);
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  const id = req.params.id;
  try {
    const user = await UserModel.getUserById(id);
    if (!user)
      return res
        .status(400)
        .json({ error: `No user with id: ${id} was found.` });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  // Authenticate user
  try {
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
    next(error);
  }
}

export function logoutUser(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
}

export async function registerUser(req, res, next) {
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
    return res.status(201).json({ message: "User successfully created!" });
  } catch (error) {
    next(error);
  }
}

export async function updateUserById(req, res, next) {
  const id = req.params.id;
  const { firstName, lastName, role } = req.body;

  try {
    const updatedUser = await UserModel.updateUserById(id, {
      firstName,
      lastName,
      role,
    });
    if (!updatedUser) {
      return res
        .status(400)
        .json({ error: `User with provided id: ${id} doesn't exist! ` });
    }
    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
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
    return res.status(200).json({
      message: `Successfully deleted user with id ${id}`,
      content: deletedUser,
    });
  } catch (error) {
    next(error);
  }
}
