import jwt from "jsonwebtoken";
import BRIEFCASE from "../service/secretKey.js";

export default function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  try {
    const user = jwt.verify(token, BRIEFCASE.SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ error: `Unauthorized! ${error}` });
  }
}
