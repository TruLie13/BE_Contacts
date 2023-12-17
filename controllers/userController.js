const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    const userEmailRegistered = await User.findOne({ email });
    if (userEmailRegistered) {
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
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email });
    //compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(401);
      throw new Error("Email or Password not valid");
    }
    res.json({ message: "login user" });
  }),

  //@desc Current user info
  //@route GET api/users/current
  //@access private
  currentUser: asyncHandler(async (req, res) => {
    res.json(req.user);
  }),

  //@desc Delete user
  //@route DELETE api/users/:id
  //@access private
  deleteUser: asyncHandler(async (req, res) => {
    const authenticatedUserId = req.user.id;
    const userIdToDelete = req.params.id;

    // Ensure that the authenticated user matches the user to be deleted
    if (authenticatedUserId !== userIdToDelete) {
      res.status(403);
      throw new Error("You do not have permission to delete this user");
    }

    // Find the user by ID and delete
    const findUserIdandDelete = await User.findByIdAndDelete(userIdToDelete);
    if (!findUserIdandDelete) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  }),
};

module.exports = userController;
