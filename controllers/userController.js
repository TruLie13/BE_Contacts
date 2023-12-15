const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");

const userController = {
  //@desc Register a user
  //@route POST api/users/register
  //@access public
  registerUser: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
      return;
    }
    const userAvilable = await User.findOne({ email });
    if (userAvilable) {
      res.status(400);
      throw new Error("User already registered");
    }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword: ", hashedPassword);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    console.log("user: ", user);
    if (user) {
      res.status(201).json({ _id: user.id, email: user.email });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
    res.json({
      message: "Register the user",
    });
  }),

  //@desc Login user
  //@route POST api/users/login
  //@access public
  loginUser: asyncHandler(async (req, res) => {
    res.json({ message: "login user" });
  }),

  //@desc Current user info
  //@route GET api/users/current
  //@access private
  currentUser: asyncHandler(async (req, res) => {
    res.json({ message: "current user information" });
  }),
};
module.exports = userController;
