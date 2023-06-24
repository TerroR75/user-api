import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
