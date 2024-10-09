require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/User");
const { SALT_ROUNDS, TOKEN_EXPIRY } = require("../config/constants");

const registerValidator = [
  body("username", "Username is required").notEmpty(),
  body("password", "Password should be a minimum of 6 characters long")
    .notEmpty()
    .isLength({ min: 6 }),
  body("email").notEmpty().isEmail(),
];

const loginValidator = [
  body("email", "Email is required").notEmpty().isEmail(),
  body("password", "Password should be a minimum of 6 characters long")
    .notEmpty()
    .isLength({ min: 6 }),
];

// creating a @POST route for user registeration
router.post("/register", registerValidator, async (req, res) => {
  const signupErrors = validationResult(req);

  if (!signupErrors.isEmpty()) {
    res.status(422).json({
      errors: signupErrors.array(),
    });
  }

  // db operations wherein we add the user to the database
  try {
    const { username, password, email } = req.body;

    // check whether the user is already registered
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // We would be hashing the password for an added layer of security
    // we first define the of salt rounds
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // defing the new user object
    user = new userModel({
      username: username,
      password: hashedPassword,
      email: email,
    });

    // waiting for user creation
    await user.save();

    // JWT for faster authentication
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.status(200).json({
      token: token,
      success: "new user has been registered",
    });
  } catch (err) {
    res.status(402).json({
      error: err.message,
    });
  }
});

// create a route for the users to login
router.post("/login", loginValidator, async (req, res) => {
  const loginErrors = validationResult(req);

  if (!loginErrors.isEmpty()) {
    res.status(422).json({
      error: loginErrors.array(),
    });
  }
  try {
    // try to extract the credentials from the body
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(402).json({
        error: "no user found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({
        error: "Invalid credentials",
      });
    }
    // JWT for faster authentication
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.status(200).json({
      token: token,
      success: `Welcome back ${user.username}`,
    });
  } catch (err) {
    res.status(402).json({
      error: err.message,
    });
  }
});

module.exports = router;
