import User from "../Schemas/UserSchema.js";

async function getAllUsers(role = "") {
  if (role === "") {
    const usersArray = await User.find();
    return usersArray;
  } else {
    const usersArray = await User.find({ role: role });
    return usersArray;
  }
}
async function getUserById(id) {
  const user = await User.findById(id);
  return user;
}
async function getUserByEmail(email) {
  const user = await User.findOne({ email: email }).exec();
  return user;
}
async function updateUserById(id, newValuesObj) {
  const user = await User.findById(id);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      firstName: newValuesObj.firstName
        ? newValuesObj.firstName
        : user.firstName,
      lastName: newValuesObj.lastName ? newValuesObj.lastName : user.lastName,
      role: newValuesObj.role ? newValuesObj.role : user.role,
    },
    { new: true }
  );
  return updatedUser;
}
async function createUser(firstName, lastName, email, role, password) {
  const user = await User.create({
    firstName,
    lastName,
    email,
    role,
    password,
  });
  return user;
}
async function deleteUser(id) {
  try {
    const user = await User.findByIdAndDelete(id);
    return user;
  } catch (error) {
    console.log(error);
  }
}

const UserModel = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  createUser,
  deleteUser,
};

export default UserModel;
