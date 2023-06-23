const User = require("../Models/User");

class UserController {
  async getAllUsers() {
    const usersArray = await User.find();
    return usersArray;
  }

  async getUserById(id) {
    const user = await User.findById(id);
    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).exec();
    return user;
  }

  async createUser(firstName, lastName, email, role, password) {
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      password,
    });
    console.log(user, " Created a new user!");
  }
}

module.exports = new UserController();
