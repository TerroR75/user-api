const User = require("../Models/User");

class UserController {
  async getAllUsers(role = "") {
    if (role === "") {
      const usersArray = await User.find();
      return usersArray;
    } else {
      const usersArray = await User.find({ role: role });
      return usersArray;
    }
  }

  async getUserById(id) {
    const user = await User.findById(id);
    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).exec();
    return user;
  }

  async updateUserById(id, newValuesObj) {
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

  async createUser(firstName, lastName, email, role, password) {
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      password,
    });
    return user;
  }

  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    return user;
  }
}

module.exports = new UserController();
